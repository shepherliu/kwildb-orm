import KwilDB from 'kwildb';

import { kwilDBHost, kwilDBProtocol} from './constant'

import { dataObject } from './models'

import { KwilDBSession } from './kwildbSession'

export const NewEngine = (host = kwilDBHost, protocol = kwilDBProtocol, moat:string = '', privateKey:string = '', secret:string = '') => {
	const engine = new KwilDBEngine(host, protocol, moat, privateKey, secret);
	engine.connect();
	if(!engine.connected()){
		return null;
	}

	return engine;
}

export class KwilDBEngine {
	private host:string;
	private protocol:string;
	private moat:string;
	private privateKey:string;
	private secret:string;
	private status = false;
	private conn:any;
	private schema:string;

	constructor(host = kwilDBHost, protocol = kwilDBProtocol, moat:string = '', privateKey:string = '', secret:string = '') {
		this.host = host;
		this.protocol = protocol;
		this.moat = moat;
		this.privateKey = privateKey;
		this.secret = secret;
		this.schema = 'public';
	}

	connect() {
		try{
			this.conn = KwilDB.createConnector({
    			host: this.host,
    			protocol: this.protocol,
    			moat: this.moat,
    			privateKey:this.privateKey,
			}, this.secret);
			this.status = true;
		}catch(e){
			this.conn = null;
			this.status = false;
			console.log(e);
		}
	}

	disconnect(){
		this.status = false;
		this.conn = null;
	}

	connected(){
		return this.status;
	}

	//start a new session
	NewSession() {
		return new KwilDBSession(this.conn, this.schema);
	}

	//select a schema
	use(schema:string = 'public'){
		if(schema != ''){
			this.schema = schema;
		}else{
			this.schema = 'public';
		}

		return this;
	}

	//raw sql query Statement
	async query(query:string, sync:boolean = false){
		return await this.conn.query(query, sync);
	}

	//raw sql query preparedStatement
	async preparedStatement(query:string, inputs:(string|number)[], sync:boolean = false){
		return await this.conn.preparedStatement(query, inputs, sync);
	}

	//get moat funding value
	async getMoatFunding(){
		return await this.conn.getMoatFunding();
	}

	//get moat debit value
	async getMoatDebit(){
		return await this.conn.getMoatDebit();
	}

	//create a new moat
	async createMoat(registry = `${kwilDBProtocol}://${kwilDBHost}`, moat:string = '', signature:string = '', address:string = ''){
		return await KwilDB.createMoat(registry, moat, signature, address);
	}

	//decrypt key
	async decryptKey(signature:string, address:string, cipherText:string){
		return await KwilDB.decryptKey(signature, address, cipherText);
	}

	//get funding pools by moat
	async getPoolsByMoat(registry = `${kwilDBProtocol}://${kwilDBHost}`, moat:string = ''){
		return await KwilDB.getPoolsByMoat(registry, moat);
	}

	//get funding pools
	async getPool(pool:string, chain:string = 'polygon', token:string = 'KRED'){
		return await KwilDB.pools.getPool(pool, chain, token);
	}

	//create funding pool
	async createFundingPool(name:string, addr:string, validator:string, chain:string = 'polygon', token:string = 'KRED', moat:string){
		return await KwilDB.pools.createFundingPool(name, addr, validator, chain, token, moat);
	}

	//fund a pool
	async fundPool(name:string, addr:string , chain:string = 'polygon', token:string = 'KRED', amount:number = 1) {
		return await KwilDB.pools.fundPool(name, addr, chain, token, amount);
	}

	//todo in the future
	async storeFile(filename:string, data:any, sync:boolean = true){
		return await this.conn.storeFile(filename, data, sync);
	}

	//todo in the future
	async storeJPEG(filename:string, data:any, sync:boolean = true){
		return await this.conn.storeJPEG(filename, data, sync);
	}

	//create schema
	async createSchema(schema:string){
		const sql = `create schema if not exists ${schema}`;
		const res = await this.conn.preparedStatement(sql, [], true);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    return true;				
	}

	//drop schema
	async dropSchema(schema:string){
		const sql = `drop schema if exists ${schema}`;
		const res = await this.conn.preparedStatement(sql, [], true);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    return true;		
	}

	//show schema
	async showSchemas(){
		const sql = `select schema_name from information_schema.schemata`;

		const res = await this.conn.preparedStatement(sql, [], false);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    const schemas = [];
	    for(let i = 0; i < res.rows.length; i++){
	    	schemas.push(res.rows[i].schema_name);
	    }

	    return schemas;		
	}

	//create table
	async createTable(tableName:string, columns:dataObject){
		let sql = `create table if not exists ${this.schema}.${tableName}`;

		const subsql = [];

		for(const k in columns){
			subsql.push(`${k} ${columns[k]}`);
		}

		sql += `(${subsql.join(',')})`;

		const res = await this.conn.preparedStatement(sql, [], true);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    return true;			
	}

	//drop table
	async dropTable(tableName:string){
	    const sql = `drop table if exists ${this.schema}.${tableName}`;
	    const res = await this.conn.preparedStatement(sql, [], true);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    return true;
	}		

	//todo in the future
	async showTables(){
	    const sql = `select table_name from information_schema.tables where table_schema = $1`;
	    const res = await this.conn.preparedStatement(sql, [this.schema], false);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    const tables = [];
	    for(let i = 0; i < res.rows.length; i++){
	    	tables.push(res.rows[i].table_name);
	    }

	    return tables;	
	}

	//todo in the future
	async descTable(tableName:string){
	    const sql = `select * from information_schema.columns where table_schema = $1 and table_name = $2`;
	    const res = await this.conn.preparedStatement(sql, [this.schema, tableName], false);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    return res.rows;		
	}

	//todo in the future
	async isTableExist(tableName:string){
	    const sql = `select table_name from information_schema.tables where table_schema = $1 and table_name = $2`;
	    const res = await this.conn.preparedStatement(sql, [this.schema, tableName], false);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    return res.rows.length > 0;	
	}			
}