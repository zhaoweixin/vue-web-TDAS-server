## Build Setup
``` bash
# install dependencies
    npm install
    npm start
```
## Route
``` bash
    post url: '.../api/getData'
        need data: none
        return data: 
            {
                "dimensions":[
                    {
                        "name": value,
                        "type": value
                    },{},
                    ...
                ],
                "description": "",
                "data":{
                    "values": [
                        {
                            key: value,
                            key: value
                        },{},
                    ]
                }
            }
        
    post url: '.../api/getDatalist'
        need data: none
        return data:
            [
                {
                    "name": value,
                    "dimensions":[
                        {
                            "name": value,
                            "type": value
                        },{},
                        ...
                    ]
                },{}
                ...
            ]
```
#How to use?

