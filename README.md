# kwildb-orm
 The kwildb-orm aims to make it easy to use kwildb in web3 platforms.

***How to run***

    npm install kwildb-orm  

***Usage***

**1. create a new kwildb engine**

   basic usage:

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
       //use a schema, default using 'public' schema
       engine.use('my_schema');       
    }
``` 

   create moat with web3 wallet

```typescript

      import { providers } from 'ethers'
      
      import { NewEngine } from './kwildbEngine'

      import { createMoat, getMoats,  decryptKey} from './kwildbEngine'

      const host = 'test-db.kwil.xyz';
      const protocol = 'https';
      const moat = 'test_cloud';
      const signingPhrase = 'signing phrase';

      let privateKey = '';
      let secret = '';

      //get a web3 provider
      const provider = new providers.Web3Provider((window as any).ethereum);

      //get a signer
      const signer = provider.getSigner();

      //get wallet address
      const address = (window as any).ethereum.selectedAddress;

      //get a signature with your signing phrase
      const signature = await signer.signMessage(signingPhrase);

      //create a new moat
      console.log(await createMoat(
         `${protocol}://${host}`,
         moat,
         signature,
         address,
      ));

      //get all moats by address
      const moats = await getMoats(`${protocol}://${host}`, address);

      //decrypt privateKey and secret by signature
      for(const i in moats){
         if(moats[i].moat === moat){
            privateKey = await decryptKey(signature, address, moats[i].api_key);
            secret = await decryptKey(signature, address, moats[i].secret);
            break;
         }
      }

      //create a new engine
      const engine = NewEngine(host, protocol, moat, privateKey, secret);
       
      if(engine != null){
         //get fundding
         console.log(await engine.getMoatFunding());
         //get debit
         console.log(await engine.getMoatDebit());
         //use a schema, default using 'public' schema
         engine.use('my_schema');       
      }

``` 

   supported functions:

```typescript

   use(schema:string = 'public'); //use a schema
   NewSession(); //start a new session
   createSchema(schema:string); //create a schema
   dropSchema(schema:string); //drop a schema
   showSchemas(); //show schemas
   createTable(tableName:string, columns:dataObject); //create a table
   dropTable(tableName:string); //drop a table
   showTables(); //show tables
   descTable(tableName:string); //desc a table
   isTableExist(tableName:string); //if table exists or not
   query(query:string, sync:boolean = false); //raw sql query Statement
   preparedStatement(query:string, inputs:(string|number)[], sync:boolean = false); //raw sql query preparedStatement


``` 

   some examples:

```typescript

      //test use a schema
      engine.use('my_schema');

      //test create schema
      console.log(await engine.createSchema('my_schema'));
      
      //test show schemas
      console.log(await engine.showSchemas());

      //test create table
      console.log(await engine.createTable('test_cloud', {
         id: 'int not null primary key',
         name: 'varchar(256) not null default(\'\')',
         timestamp: 'int not null',
      }));

      //test show tables
      console.log(await engine.showTables());

      //test table exists
      console.log(await engine.isTableExist('test_cloud'));    

      //test desc table
      console.log(await engine.descTable('test_cloud'));

      //test drop table
      console.log(await engine.dropTable('test_cloud'));     
      
      //test drop schema
      console.log(await engine.dropSchema('my_schema'));

      //test basic sql Statement
      console.log(await engine.query('create table if not exists test_cloud3(id int not null primary key, name varchar(256), timestamp int)', true));

      //test basic sql preparedStatement
      console.log(await engine.preparedStatement('insert into test_cloud3 (name) values ($1),($2)', ["ccc","ddd"], true));
      console.log(await engine.preparedStatement('select * from test_cloud', [], false));      

```    

**2. create a new session**

   basic usage:

```typescript

   //start a new session from the engine
   const session = engine.NewSession();

   //use a schema, default use the same schema as the engine set.
   session.use('public');

```  

   surported orm functions:
  
```typescript
        
	table(tableName:string); //select table name
	select(select:string[] = []); //select columns
	limit(limit:number, offset:number = 0); //limit condition
	groupBy(colName:string); //group by column
	orderBy(colName:string, order:orderType = 'asc'); //order by asc,desc
	id(pk:number | dataObject); //id condition, number or (k,v) maps
	where(colName:string, operator:operatorType, value:any); //where condition
	and(colName:string, operator:operatorType, value:any); //and condition
	or(colName:string, operator:operatorType, value:any); //or condition
	insert(data:dataObject[], sync:boolean = true); //insert datas
	insertOne(data:dataObject, sync:boolean = true); //insert one data
	update(data:dataObject, sync:boolean = true); //update datas
	delete(data:dataObject = {}, sync:boolean = true); //detele datas
        truncate(sync:boolean = true); //truncate datas
	exist(data:dataObject = {}, sync:boolean = false); //if data exist or not
	get(data:dataObject = {}, sync:boolean = false); //get one data
	first(data:dataObject = {}, sync:boolean = false); //first data
	find(data:dataObject = {}, sync:boolean = false); //find datas
	count(colName:string = '*', sync:boolean = false); //data count
	max(colName:string, sync:boolean = false); //data max
	min(colName:string, sync:boolean = false); //data min
	avg(colName:string, sync:boolean = false); //data avg
	sum(colName:string, sync:boolean = false); //data sum
        query(query:string, sync:boolean = false); //raw sql Statement
        preparedStatement(query:string, inputs:(string|number)[], sync:boolean = false); //raw sql preparedStatement
	begin(); //begin sql transaction
	queue(query:string); //push sql to transaction queues, not suport preparedStatement now
	commit(); //commit sql transaction
	rollback(); //rollback sql transaction, todo in the future
	close(); //close sql transaction
```

   some examples:

```typescript

   let res;
   
   const session = engine.NewSession().use('public');
   
   //truncate data
   res = await session.table('test_cloud3').truncate();
   console.log(res);

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

   demo video: https://www.youtube.com/watch?v=dPkGK1-qiUc
   
***Development contract:***
  
   email: shepher.liu@gmail.com
   
   discord: swarmlover#4063
