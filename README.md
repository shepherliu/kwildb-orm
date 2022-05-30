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
**2. basic engine usage**
```typescript
    let res;
    //create a new table, use query
    res = await engine.query('create table test_cloud3(id int not null primary key, name varchar(256), timestamp int)', [], true);
    console.log(res);
    //insert data, use preparedStatement to prevent sql inject
    res = await engine.preparedStatement('insert into test_cloud3 (name) values ($1),($2)', ["ccc","ddd"], true);
    console.log(res);
    //select data
    res = await engine.preparedStatement('select * from test_cloud', [], false);
    console.log(res);
    //delete table
    res = await engine.dropTables('test_cloud3');
    console.log(res);
```

**3. create a new session**
```typescript
   let res;
   
   const session = engine.NewSession();
   
   //insert data
   res = session.table('test_cloud3').insert([
			  {
				   id:2,
				   name: 'ddd',
			  },
			  {
				   id:3,
				   name: 'mmm',
			  },
		 ]);
   console.log(res);
   //update data
   res = await session.table('test_cloud3').where('name', 'like', '%cc%').update({name: 'vvv'});
   console.log(res);
   //delete data
   res = await session.table('test_cloud3').where('id', '=', 2).or('id', '=', 3).delete();
   console.log(res);
   //get data with id()
   res = await session.table('test_cloud3').id(3).get();
   console.log(res);
   //get data with paramter
   res = await session.table('test_cloud3').get({id:1});
   console.log(res);
   //exist data
   res = await session.table('test_cloud3').select(['id','name']).limit(3).orderBy('id', 'asc').groupBy('id').where('id', '>=', 1).exist();
   console.log(res);
   //get data
   res = await session.table('test_cloud3').select(['id','name']).limit(3).orderBy('id', 'asc').groupBy('id').where('id', '>=', 1).get();
   console.log(res);
   //get first data
   res = await session.table('test_cloud3').select(['id','name']).limit(3).orderBy('id', 'asc').groupBy('id').where('id', '>=', 1).first();
   console.log(res);
   //find datas
   res = await session.table('test_cloud3').select(['id','name']).limit(3).orderBy('id', 'asc').groupBy('id').where('id', '>=', 1).find();
   console.log(res);
   
   //data count
   console.log(await session.table('test_cloud3').where('id', '>', 1).groupBy('name').count('id'));
   //data max
		 console.log(await session.table('test_cloud3').where('id', '>', 1).groupBy('name').max('id'));
   //data min
		 console.log(await session.table('test_cloud3').where('id', '>', 1).groupBy('name').min('id'));
   //data avg
		 console.log(await session.table('test_cloud3').where('id', '>', 1).groupBy('name').avg('id'));
   //data sum
		 console.log(await session.table('test_cloud3').where('id', '>', 1).groupBy('name').sum('id'));
```
***Resources:***

   kwildb github: https://github.com/kwilteam/kwil_db_api
   
   xorm docs: https://xorm.io/docs/
   
***Development contract:***
  
   email: shepher.liu@gmail.com
   
   discord: swarmlover#4063
