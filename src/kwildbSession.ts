import { dataObject, operatorType, orderType } from './models'

export class KwilDBSession {
	private conn:any;
	private session:any;

	private tableName:string;
	private toSelect: string;
	private toWhere:string;
	private toLimit:string;
	private toOrder:string;
	private toGroug:string;
	private toValues: any[];
	private preparedCount: number;
	

	constructor(conn:any){
		this.conn = conn;
		this.session = null;
		this.tableName = '';
		this.toSelect = '*';
		this.toWhere = '';
		this.toLimit = '';
		this.toOrder = '';
		this.toGroug = '';
		this.toValues = [];
		this.preparedCount = 1;
	}

	table(tableName:string){
		this.clear();
		this.tableName = tableName;
		return this;
	}

	select(select:string[]){
		if(select.length === 0){
			this.toSelect  = '*';
		}else{
			this.toSelect = select.join(',');
		}
		return this;
	}

	limit(limit:number){
		limit = Math.floor(limit);
		if(limit > 0){
			this.toLimit = `limit ${limit}`;
		}else{
			this.toLimit = '';
		}
		return this;
	}	

	groupBy(colName:string) {
		this.toGroug = `group by ${colName}`;
		return this;
	}

	orderBy(colName:string, order:orderType) {
		this.toOrder = `order by ${colName} ${order}`;
		return this;
	}	

	id(pk:number | dataObject){
		if(typeof pk === 'number') {
			return this.where('id', '=', pk);
		}

		for(const k in (pk as dataObject)){
			this.where(k, '=', pk[k]);
		}

		return this;
	}

	where(colName:string, operator:operatorType, value:any){
		if(this.toWhere === ''){
			this.toWhere = 'where ';
		}else{
			this.toWhere = `${this.toWhere} and `;
		}

		return this.filter(colName, operator, value);
	}

	and(colName:string, operator:operatorType, value:any){
		return this.where(colName, operator, value);
	}

	or(colName:string, operator:operatorType, value:any){
		if(this.toWhere === ''){
			this.toWhere = 'where ';
		}else{
			this.toWhere = `${this.toWhere} or `;
		}

		return this.filter(colName, operator, value);
	}

	private filter(colName:string, operator:operatorType, value:any){
		let val = [];

		switch(operator){
			case 'between':
				this.toWhere += `${colName} between $${this.preparedCount++} and $${this.preparedCount++}`;
				this.toValues.push((value as any[])[0]);
				this.toValues.push((value as any[])[1]);
				break;
			case 'in':
				val = [];
				for(let i = 0; i < (value as any[]).length; i++){
					val.push(`$${this.preparedCount++}`);
					this.toValues.push((value as any[])[i]);
				}
				this.toWhere += `${colName} in (${val.join(',')})`;
				break;
			case 'not in':
				val = [];
				for(let i = 0; i < (value as any[]).length; i++){
					val.push(`$${this.preparedCount++}`);
					this.toValues.push((value as any[])[i]);
				}			
				this.toWhere += `${colName} not in (${val.join(',')})`;
				break;
			case 'is':
				if(value === null){
					this.toWhere += `${colName} is null`;
				}else if(value === true){
					this.toWhere += `${colName} is true`;
				}else if(value === false){
					this.toWhere += `${colName} is false`;
				}else{
					this.toWhere += `${colName} is $${this.preparedCount++}`;
					this.toValues.push(value);
				}
				break;
			case 'is not':
				if(value === null){
					this.toWhere += `${colName} is not null`;
				}else if(value === true){
					this.toWhere += `${colName} is not true`;
				}else if(value === false){
					this.toWhere += `${colName} is not false`;
				}else{
					this.toWhere += `${colName} is not $${this.preparedCount++}`;
					this.toValues.push(value);
				}
				break;
			case 'like':
				this.toWhere += `${colName} like $${this.preparedCount++}`;
				// this.toWhere += `${colName} like ${value}`;
				this.toValues.push(value);
				break;			
			default:
				this.toWhere += `${colName} ${operator} $${this.preparedCount++}`;
				this.toValues.push(value);
				break;
		}

		return this;
	}

	async insert(data:dataObject[], sync:boolean = true) {
		const keys = Object.keys(data[0]);

		let sql = `insert into ${this.tableName} (${keys.join(',')}) values `;
		let val = [];

		this.preparedCount = 1;

		for(let i = 0; i < data.length; i++){
			let subsql = [];
			for(const j in keys){
				subsql.push(`$${this.preparedCount++}`);
			}
			sql += `(${subsql.join(',')})`;

			if(i < data.length - 1){
				sql += ',';
			}

			for(let j = 0; j < keys.length; j++){
				val.push(data[i][keys[j]]);
			}
		}

		const res = await this.conn.preparedStatement(sql, val, sync);

		if (typeof res === 'string') {
      		throw new Error(res);
    	}

    	return res.rowCount;	
	}

	async insertOne(data:dataObject, sync:boolean = true) {
		return await this.insert([data]);
	}

	async update(data:dataObject, sync:boolean = true){
		let sql = `update ${this.tableName} set `;
		let subsql = [];

		for(const k in data){
			subsql.push(`${k} = $${this.preparedCount++}`);
			this.toValues.push(data[k]);
		}

		sql += subsql.join(',');
		sql = `${sql} ${this.toWhere} ${this.toGroug} ${this.toOrder} ${this.toLimit}`;

		const res = await this.conn.preparedStatement(sql, this.toValues, sync);

		if (typeof res === 'string') {
      		throw new Error(res);
    	}

    	return res.rowCount;		
	}	

	async delete(data:dataObject = {}, sync:boolean = true) {
		for(const k in data){
			this.where(k, '=', data[k]);
		}

		const sql = `delete from ${this.tableName} ${this.toWhere} ${this.toGroug} ${this.toOrder} ${this.toLimit}`;
		const res = await this.conn.preparedStatement(sql, this.toValues, sync);

		if (typeof res === 'string') {
      		throw new Error(res);
    	}

    	return res.rowCount;
	}

	async exist(data:dataObject = {}, sync:boolean = false){
		const res = await this.limit(1).find(data, sync);
		if(res.length === 0){
			return false;
		}
		
		return true;
	}

	async get(data:dataObject = {}, sync:boolean = false){
		const res = await this.limit(1).find(data, sync);
		if(res.length === 0){
			return null;
		}

		return res[0];
	}	

	async first(data:dataObject = {}, sync:boolean = false) {
		const res = await this.limit(1).find(data, sync);
		if(res.length === 0){
			return null;
		}
		
		return res[0];
	}	

	async find(data:dataObject = {}, sync:boolean = false) {
		for(const k in data){
			this.where(k, '=', data[k]);
		}
				
		const sql = `select ${this.toSelect} from ${this.tableName} ${this.toWhere} ${this.toGroug} ${this.toOrder} ${this.toLimit}`;
		const res = await this.conn.preparedStatement(sql, this.toValues, sync);

		if (typeof res === 'string') {
      		throw new Error(res);
    	}

    	return res.rows;
	}	

	async count(colName:string = '*', sync:boolean = false) {
		const sql = `select count(${colName}) from ${this.tableName} ${this.toWhere} ${this.toGroug} ${this.toOrder} ${this.toLimit}`;
		const res = await this.conn.preparedStatement(sql, this.toValues, sync);

		if (typeof res === 'string') {
      		throw new Error(res);
    	}	
		
    	const rows = [];

    	for(const i in res.rows){
    		rows.push(parseFloat(res.rows[i].count));
    	}
		
		return rows;
	}	

	async max(colName:string, sync:boolean = false) {
		const sql = `select max(${colName}) from ${this.tableName} ${this.toWhere} ${this.toGroug} ${this.toOrder} ${this.toLimit}`;
		const res = await this.conn.preparedStatement(sql, this.toValues, sync);

		if (typeof res === 'string') {
      		throw new Error(res);
    	}	
		
    	const rows = [];

    	for(const i in res.rows){
    		rows.push(parseFloat(res.rows[i].max));
    	}
		
		return rows;
	}

	async min(colName:string, sync:boolean = false) {
		const sql = `select min(${colName}) from ${this.tableName} ${this.toWhere} ${this.toGroug} ${this.toOrder} ${this.toLimit}`;
		const res = await this.conn.preparedStatement(sql, this.toValues, sync);

		if (typeof res === 'string') {
      		throw new Error(res);
    	}	
		
    	const rows = [];

    	for(const i in res.rows){
    		rows.push(parseFloat(res.rows[i].min));
    	}
		
		return rows;
	}

	async sum(colName:string, sync:boolean = false){
		const sql = `select sum(${colName}) from ${this.tableName} ${this.toWhere} ${this.toGroug} ${this.toOrder} ${this.toLimit}`;
		const res = await this.conn.preparedStatement(sql, this.toValues, sync);

		if (typeof res === 'string') {
      		throw new Error(res);
    	}	
		
    	const rows = [];

    	for(const i in res.rows){
    		rows.push(parseFloat(res.rows[i].sum));
    	}
		
		return rows;
	}

	async avg(colName:string, sync:boolean = false){
		const sql = `select avg(${colName}) from ${this.tableName} ${this.toWhere} ${this.toGroug} ${this.toOrder} ${this.toLimit}`;
		const res = await this.conn.preparedStatement(sql, this.toValues, sync);

		if (typeof res === 'string') {
      		throw new Error(res);
    	}

    	const rows = [];

    	for(const i in res.rows){
    		rows.push(parseFloat(res.rows[i].avg));
    	}
		
		return rows;
	}

	private clear(){
		this.tableName = '';
		this.toSelect = '*';
		this.toWhere = '';
		this.toLimit = '';
		this.toOrder = '';
		this.toGroug = '';
		this.toValues = [];
		this.preparedCount = 1;
	}

	//begin session
	async begin(){
		this.clear();
		this.session = this.conn.createTransaction();
		this.session.begin();

		return this;
	}

	//sql query for session
	async query(query:string){
		this.session.query(query);
	}

	//commit session
	async commit(){
		if(this.session === null){
			this.clear();
		}else{
			return await this.session.commit();
		}

		return null;
	}

	//rollback session, todo in the future
	async rollback(){
		if(this.session === null){
			this.clear();
		}else{
			return await this.session.rollback();
		}

		return null;
	}	

	//close session
	async close(){
		this.session = null;
		this.clear();
	}
}