function sendMessage(message) {
    chrome.runtime.sendMessage({type: 'streamlit', message: message});
  }
  
  function receiveMessage(request, sender, sendResponse) {
    if (request.type === 'streamlit') {
      const iframe = document.querySelector('iframe');
      iframe.contentWindow.postMessage(request.message, '*');
    }
  }
  
  chrome.runtime.onMessage.addListener(receiveMessage);
  
  sendMessage({type: 'streamlit', message: 'ready'});
  
  window.addEventListener('message', function(event) {
    if (event.origin !== 'http://localhost:8501') {
      // Only accept messages from the Streamlit app
      return;
    }
  
    if (event.data.type === 'streamlit') {
      switch (event.data.action) {
        case 'fetch_top_news':
          fetch_top_news().then(news_list => {
            sendMessage({type: 'streamlit', message: {action: 'display_news', news_list: news_list}});
          }).catch(error => {
            sendMessage({type: 'streamlit', message: {action: 'display_error', error: error.message}});
          });
          break;
        case 'fetch_category_news':
          const category = event.data.category;
          fetch_category_news(category).then(news_list => {
            sendMessage({type: 'streamlit', message: {action: 'display_news', news_list: news_list}});
          }).catch(error => {
            sendMessage({type: 'streamlit', message: {action: 'display_error', error: error.message}});
          });
          break;
        case 'fetch_news_search_topic':
          const topic = event.data.topic;
          fetch_news_search_topic(topic).then(news_list => {
            sendMessage({type: 'streamlit', message: {action: 'display_news', news_list: news_list}});
          }).catch(error => {
            sendMessage({type: 'streamlit', message: {action: 'display_error', error: error.message}});
          });
          break;
        default:
          // Do nothing
          break;
      }
    }
  });
  
  function fetch_top_news() {
    return new Promise((resolve, reject) => {
      const url = 'https://news.google.com/news/rss';
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = () => {
        if (xhr.status === 200) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');
          const newsList = xmlDoc.getElementsByTagName('item');
          const newsItems = Array.from(newsList).map(item => {
            return {
              title: item.getElementsByTagName('title')[0].textContent,
              link: item.getElementsByTagName('link')[0].textContent,
              pubDate: item.getElementsByTagName('pubDate')[0].textContent,
              source: item.getElementsByTagName('source')[0].textContent,
            };
          });
          resolve(newsItems);
        } else {
          reject(new Error('Failed to fetch news'));
        }
      };
      xhr.onerror = () => {
        reject(new Error('Failed to fetch news'));
      };
      xhr.send();
    });
  }
  
  function fetch_category_news(topic) {
    return new Promise((resolve, reject) => {
      const site = `https://news.google.com/news/rss/headlines/section/topic/${topic}`;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', site);
      xhr.onload = () => {
        if (xhr.status === 200) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');
          const newsList = xmlDoc.getElementsByTagName('item');
          const newsItems = Array.from(newsList).map(item => {
            return {
              title: item.getElementsByTagName('title')[0].textContent,
              link: item.getElementsByTagName('link')[0].textContent,
              pubDate: item.getElementsByTagName('pubDate')[0].textContent,
              source: item.getElementsByTagName('source')[0].textContent,
            };
          });
          resolve(newsItems);
        } else {
          reject(new Error('Failed to fetch news'));
        }
      };
      xhr.onerror = () => {
        reject(new Error('Failed to fetch news'));
      };
      xhr.send();
    });
  }
  function fetch_news_search_topic(topic) {
    return new Promise((resolve, reject) => {
      const site = `https://news.google.com/rss/search?q=${topic}&hl=en_US&gl=US&ceid=US:en`;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', site);
      xhr.onload = () => {
        if (xhr.status === 200) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');
          const newsList = xmlDoc.getElementsByTagName('item');
          const newsItems = Array.from(newsList).map(item => {
            return {
              title: item.getElementsByTagName('title')[0].textContent,
              link: item.getElementsByTagName('link')[0].textContent,
              pubDate: item.getElementsByTagName('pubDate')[0].textContent,
              source: item.getElementsByTagName('source')[0].textContent,
            };
          });
          resolve(newsItems);
        } else {
          reject(new Error('Failed to fetch news'));
        }
      };
      xhr.onerror = () => {
        reject(new Error('Failed to fetch news'));
      };
      xhr.send();
    });
  }