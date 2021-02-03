import Axios from "axios";
import ProductDataManager from '../util/ProductDataManager';

let source = Axios.CancelToken.source();
  setTimeout(() => {
    source.cancel();
    // Timeout Logic
  }, 5000);

export const GetApiCall = (url) => {
  console.log(`userObj: ${JSON.stringify(ProductDataManager.getInstance().getUser().customer_id)}`);
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'customerId': ProductDataManager.getInstance().getUser().customer_id,
    },
  })
    .then((response) => {
      var statusCode = response.status;
      console.log(`statusCode ${statusCode}`)
      if (statusCode == 200) {
        const data = response.json();
        return Promise.all([statusCode, data]);
      } else {
        console.log(`error statusCode ${statusCode}`);
        return null;
      }
    })
    .then(([statusCode, responseJson]) => {
      //console.log(`statusCode: ${statusCode} response:${JSON.stringify(responseJson)}`);
      return responseJson;
    })
    .catch((error) => {
      console.log(error);
    });
}
export const GetApiRequest = (url) => {
  console.log(`url:${url}`);
  return Axios.get(url)
    .then((response) => {
      //console.log(`response: ${JSON.stringify(response.data)}`);
      //console.log(`Axios Response: ${JSON.stringify(response.data)}`);
      if (response.status) {
        return response.data;
      } else {
        console.log(`status: ${response.statusCode}`);
        return null;
      }
    })
    .catch((error) => {
      console.log(`error: ${error}`);
    });
}
export const PostApiRequest = (url, body) => {
  const customerId = ProductDataManager.getInstance().getUser() !== null ? ProductDataManager.getInstance().getUser().customer_id : '';
  return Axios.post(
    url,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer tmsaqaj546ftvd1gd1jf7c13nwn7fva1',
        'customerId': customerId,
      }
    }
  ).then((response) => {
    console.log(`url:${url} body: ${JSON.stringify(body)}`);
    //console.log(`Axios Response: ${JSON.stringify(response.data)}`);
    if (response.status) {
      return response.data;
    } else {
      console.log(`status: ${response.statusCode}`);
      return null;
    }
  }).catch((error) => {
    console.log(`url:${url} body: ${JSON.stringify(body)}`);
    console.log(`catch error: ${error}`);
  });
}

export const PutApiRequest = (url, body) => {
  return Axios.put(
    url,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer tmsaqaj546ftvd1gd1jf7c13nwn7fva1'
      }
    }
  ).then((response) => {
    console.log(`url: ${url} method: put body: ${JSON.stringify(body)}`);
    //console.log(`Axios Response: ${JSON.stringify(response.data)}`);
    if (response.status) {
      return response.data;
    } else {
      console.log(`status: ${response.statusCode}`);
      return null;
    }
  }).catch((error) => {
    console.log(`url:${url} body: ${JSON.stringify(body)}`);
    console.log(`catch error: ${error}`);
  });
}

export const DeleteApiRequest = (url) => {
  console.log(`url:${url}`);
  return Axios.delete(url)
    .then((response) => {
      console.log(`respons ${JSON.stringify(response.data)}`);
      return response.data;
    }).catch((error) => {
      console.log(`error: ${error}`);
    })
}

export const PostApiCall = (url, body) => {
  console.log(`url0: ${url} body0: ${body}`);
  var bb = JSON.stringify(body);
  console.log(`url: ${url} body: ${bb}`);
  //console.log('call postapicall');
  return fetch(url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body),
    }
  )
    .then((response) => {
      var statusCode = response.status;
      console.log(`response12 ${JSON.stringify(response.json())}`)
      if (statusCode == 200) {
        const data = response.json();
        return Promise.all([statusCode, data]);
      } else {
        console.log(`error statusCode ${statusCode}`);
        return null;
      }
    })
    .then(([statusCode, responseJson]) => {
      //console.log(`statusCode: ${statusCode} response:${JSON.stringify(responseJson)}`);
      return responseJson;
    })
    .catch((error) => {
      console.log(error);
    });
}

export const UploadImage = (url, body) => {
  return fetch(
    // eslint-disable-line no-undef
    url,
    {
      body,
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data; charset=utf-8;",
        "api-access-key": "b1b1d7942d833d1bd94fa321418430f2",
        Authorization: "Bearer tmsaqaj546ftvd1gd1jf7c13nwn7fva1"
      }
    }
  )
    .then(res => res.json())
    .then(json => {
      console.log("json after uploading", json)
      return json;
      /*if (json.file_id && json.name && json.url) {
        console.log(`done everything is good`);
        //this.showUploadedPrescription(json);
      } else {
        console.log(`something is wrong`);
      }*/
    })
    .catch((err) => {
      console.log('error uploading presc', err);
      return null;
    });
}

