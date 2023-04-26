window.addEventListener('transferData', function (e) {
  startIntercept(e.detail);
});

function verify(data, input) {
  return data.find((row) => {
    return row[0]?.toString() === input;
  });
}

function startIntercept(data) {
  const originalOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function (method, url) {
    if (arguments.length >= 2 && arguments[0] !== '') {
      if (
        arguments[1].search(
          'https://twitter.com/i/api/graphql/.*/HomeTimeline'
        ) !== -1
      ) {
        if (!this._xhr_response_hooked) {
          this._xhr_response_hooked = true;
          setResponseHook(this);
        }
      }
    }

    return originalOpen.apply(this, arguments);
  };

  function setResponseHook(xhr, timeline_type) {
    function getter() {
      delete xhr.responseText;
      let xhr_response = xhr.responseText;

      try {
        let json = JSON.parse(xhr_response);

        newResponse = parseJson(json);

        console.log('made it to newResponse');
        console.log(json);

        xhr_response = JSON.stringify(newResponse);
      } catch (e) {
        console.log(e);
        console.warn('Failed to parse responseText as JSON');
      }

      setup();

      return xhr_response;
    }

    function setter(str) {
      this._var = str;
    }

    function setup() {
      Object.defineProperty(xhr, 'responseText', {
        _var: '',
        get: getter,
        set: setter,
        configurable: true,
      });
    }
    setup();
  }

  function parseJson(json) {
    if (
      json?.['data']?.['home']?.['home_timeline_urt']?.['instructions']?.[0]?.[
        'entries'
      ]
    ) {
      for (
        let i = 0;
        i <
        json['data']['home']['home_timeline_urt']['instructions'][0]['entries']
          .length;
        i++
      ) {
        if (
          json['data']['home']['home_timeline_urt']['instructions'][0][
            'entries'
          ][i]?.['content']?.['itemContent']?.['tweet_results']?.['result']?.[
            'core'
          ]?.['user_results']?.['result']?.['legacy']?.[
            'profile_image_url_https'
          ]
        ) {
          let wasVerified = verify(
            data,
            json['data']['home']['home_timeline_urt']['instructions'][0][
              'entries'
            ][i]['content']['itemContent']['tweet_results']['result']['core'][
              'user_results'
            ]['result']['rest_id']
          );

          if (wasVerified) {
            json['data']['home']['home_timeline_urt']['instructions'][0][
              'entries'
            ][i]['content']['itemContent']['tweet_results']['result']['core'][
              'user_results'
            ]['result']['legacy']['profile_image_url_https'] =
              json['data']['home']['home_timeline_urt']['instructions'][0][
                'entries'
              ][i]['content']['itemContent']['tweet_results']['result']['core'][
                'user_results'
              ]['result']['legacy']['profile_image_url_https'] +
              '#legacy-verified';
          }
        }
      }
      return json;
    } else {
      return json;
    }
  }
}
