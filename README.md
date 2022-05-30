# kwildb-orm
 The kwildb-orm aims to make it easy to use kwildb in web3 platforms.

***How to run***

    npm install kwildb-orm  

***Usage***

**1. create a new kwildb engine**

```typescript

    import NewEngine from 'kwildb-orm'
    
    const privateKey = JSON.parse(fs.readFileSync('./privateKey.json').toString());
    const host = 'test-db.kwil.xyz';
    const protocol = 'https';
    const moat = 'test_cloud';
    const secret = '7smx9dFXuLrbI8]ju+~:Jly#aMN,xis/';
    
    const engine = NewEngine(host, protocol, moat, privateKey, secret);
    
    if(engine != null){
       //get fundding
       console.log(await engine.getMoatFunding());
       //get debit
       console.log(await engine.getMoatDebit());
    }
``` 
***Resources:***

   kwildb github: https://github.com/kwilteam/kwil_db_api
   
   xorm docs: https://xorm.io/docs/
   
***Development contract:***
  
   email: shepher.liu@gmail.com
   
   discord: swarmlover#4063
