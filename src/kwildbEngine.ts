import KwilDB from 'kwildb';

import { kwilDBHost, kwilDBProtocol} from './constant'

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

	constructor(host = kwilDBHost, protocol = kwilDBProtocol, moat:string = '', privateKey:string = '', secret:string = '') {
		this.host = host;
		this.protocol = protocol;
		this.moat = moat;
		this.privateKey = privateKey;
		this.secret = secret;
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
		return new KwilDBSession(this.conn);
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

	//todo in the future
	async showTables(){
	    const sql = `show tables`;
	    const res = await this.preparedStatement(sql, [], true);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    return res;		
	}

	//todo in the future
	async descTables(tableName:string){
	    const sql = `desc table ${tableName}`;
	    const res = await this.preparedStatement(sql, [], true);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    return res;		
	}

	//todo in the future
	async isTableExist(tableName:string){
	    const sql = `desc table ${tableName}`;
	    const res = await this.preparedStatement(sql, [], true);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    return true;	
	}	

	//todo in the future
	async dropTables(tableName:string){
	    const sql = `truncate ${tableName}`;
	    const res = await this.preparedStatement(sql, [], true);
	    if (typeof res === 'string') {
	      throw new Error(res);
	    }

	    return true;
	}	
}