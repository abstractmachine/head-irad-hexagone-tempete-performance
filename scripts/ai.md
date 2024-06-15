# Notes

Cf. <https://community.openai.com/t/communicating-with-the-api-in-vanilla-js-no-server-side-stuff/4984/6>

```
curl https://api.openai.com/v1/engines/davinci/completions \ -H "Content-Type: application/json" \ -H "Authorization: Bearer $OPENAI_API_KEY" \ -d '{ "prompt": "", "temperature": 0.7, "max_tokens": 64, "top_p": 1, "frequency_penalty": 0, "presence_penalty": 0 }'
```

```
function OpenaiFetchAPI() {
    console.log("Calling GPT3")
    var url = "https://api.openai.com/v1/engines/davinci/completions";
    var bearer = 'Bearer ' + YOUR_TOKEN
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "prompt": "Once upon a time",
            "max_tokens": 5,
            "temperature": 1,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "logprobs": null,
            "stop": "\n"
        })


    }).then(response => {
        
        return response.json()
       
    }).then(data=>{
        console.log(data)
        console.log(typeof data)
        console.log(Object.keys(data))
        console.log(data['choices'][0].text)
        
    })
        .catch(error => {
            console.log('Something bad happened ' + error)
        });

}
```