import { NewEngine, KwilDBEngine} from './kwildbEngine'
import { KwilDBSession } from './kwildbSession'

export { KwilDBEngine, KwilDBSession};
export * from './models';
export default NewEngine;

import { kwilDBHost, kwilDBProtocol} from './constant'

const test = async () => {
	const privateKey = JSON.parse(`{"kty":"RSA","n":"wx6YnC-FL7x2rr1Oe3a2SLxO10ylwekWbOPFTB1kPvbf2mZ9uBgTI-X7-pO-uiyjNh5oa5xCa41ofsA-QiWg5Zsu-pjK-r3p5_Ib2blGzdtLEsloC7Nde_6H0tP9H_LmZ2cscX_YikrI7zTnXvUCIu7vkimoGth2uT5VSCRPs9g5Fa2Zo9Bsb8TJq24BWyQIMUe3UGMSoQ-LZiIjtDZ9Kze9pZzBBgTJxZEQYUuzV9dY7OFZcwZyZ2LI-xYCEfvu4NzU7MfEReVlewX5xCg559vA0s0twsiaLBRspUKdemicgBDRNDw2ylBwGY7TL7LxDWG2qL-3ev5B-YoMzSvWpfSHJIqIYR3SEcXvLxMC2zbcKanIU3pp8N5tbY_0IDQp0Nb26uXW5cA5V2AT6-LGCiu0FUVgec6Mtydz6XFjdfAYf5x-1AcL-ONgbFK_PqUoL2UxIc4YyR6GWdFEl4XvGKYAP5eVMh9c_VUUqY9UuW7wHJtcNZhB0C_hzG64L3bj1t9cZTq9C7uj9Hx_SUMD7XR8X-iJYZjndTMswXT82kBJVAxvcHUOaL2SDh1H1ekT6qtXqpPlqrzunL3Alkge7Kpand8c67j4rERdu9IlwAMC-dffFZMuK7BiV8ZScPLLabaRYg6QCOjau9dz-XhWH5V744qpbh1lM06mHoaH6Ls","e":"AQAB","d":"D7kq9hxpi1UQwU21rIL-oceJmOrvHpGrF3TsBLwHmdVTaP-XrkVDtuxaYlu-jl_OJSx3y1gpDWQJ9tDaE4LXFORCTw-5_Pu0hNbrQfUet18Dt-ICtZKrfAmg-1nO4jYKNWyd1brw1wVmF3SiwnGpoulbOo2LI41W_-Aoh4A5lgCyFO-g27pjdUbyiL3Rc9KTAG71iY-k7tVYV-TKDhnSpgVqDcBJ2QjQvlAiyvG1OY-7yuxGmjDQ-PN_xlAEibDMvqe9AXmq9Nuip7JtvqNj4IMXu5pXei9Se9kyKh0UoJ_GdhbPgk8_NmLGAyE8c8cOir6u3_6sXp0XnEVwzlBz4wFJmefR9ouU3zbaiMbrTiTWuZZ9ArgMTGkinSbWzrSMvK8ytyep5SLTIbedrDL5ExVCvgnoLpaZO_OGhvkOrm7NP4lsbAoj2AnBJPIJ8rQmO5x9KRAOA26eDBrnoKqoLJuxx8vAJLiZdCbN3S_K2xj6mcwu61sMxJll8Gjd1ZnHPn_9wYxNWCW4YFvDw4qNrZcUXW16jjjg8jHiZHB1HDVB51iGbCuSSlU-RaHa8bW2UxOuBZHaxCs2lsmUIs-V8y7_WqTaCTN4-E5NE_WVue6r-2DB5Fu0nQqafiqegCX_1yvu-j9jPdFtvcAHlscIQ1RjpVgUjO144cYV-sVgSE0","p":"7BBucvr1zhFZhzR8i8-v9JYlebwN7Akj8x2xYXfYE1-TLmHfzPJzolCBAtIUxva5GEdBWLMBtraScPIqMVHsR8YUxc_DzxoP5cyNT4C0NAdZCIEVyn46gVfGabogElnZb8ouhrUsAiO22p2bONMJrZYXdDP-fD6D9tCVh1W1k4LmhXuWY9sN4RavTmAFW1R5ziZvNFxtCuMQ6EcRcMRzcjsBEPQikygHP_-XuMuxIaUCVDyEYNEQNLGmLlZYRNBnt9HJ64vBHIMh19A0JBZ684iqtAG7Pa8wd_NZwvifs2JHwAD1gi0NuVx-hTGY3CjJ6r3PNSJgB0fsyc2BG6mgPw","q":"05j3DyoopCqc_-1UkkOfdeeh9_-9OlbbcL5QnqgXlpGcmSf3rl425SAQQ0GTFZNiQHU9X23vl63yppmrTI8s0oB3rxtQ41rrs0g71O6zQJ3ndnJUKlz6uq3wWx7HIRJSUzRB5vCYZ8jeJkfoQxD_Yc69k0CByxyT7q6L7ceN6zDGP3rK0C6yQVLthBO2rSiKkMZkTlkxwayiRFMicmyC5u8V7K8dFd25iLlimc-UplcDEMHZBtC9HIQfhVP5Rh-uJRdX1u8yFXdvEky1G8OHMTQqJptE2NzAKx4f0YDVi7Wh-mcM9sN_18jM3UZWXjmlS2UiXU4AJiLe0XJ-sy5YhQ","dp":"BPW_bFkLix3gNLAMod9mQgxZkzo5TKlQgQ4xqOuctaN_cy0JR8QcW9-3JjkFyLxsXS86F0QDmDQz1X2xF0IyZbuquhFIevSAOwLWQUJiBunUnBIiRBPs5MTUXWpUvC35HJkx6xCpcQ4RDHzdQw9kF6qcqYtiIHgry6bMTYCmhQfuEgXrvgNfQkh4vHvWAPpAaO1zzrTWcbEdrNO5cRYfmtnUhueqRk9D_7s-E9rryNovt1diLKqX3ZOR-01DI4cBduJIjNNt5kx3DJLKVavHP5CyjX-v0Hb63LpXO3p_2IQLH-SlQ-vwauGfourM3Gta-rysOuCTBfQj7IWN3eftfw","dq":"m6AQbYXbWErDJ_Qc1GqJ-ITBeo4MVcEWKki_MMF-f85et8JOh19hzokTjPPIwwCgLbpMxkgsBIn6QpAZDfjrxXKZFB_qER2I51ZEMyrQicDZQSN7RaEXA3_0nH_5gxhfljSEF99yqDpzMQKID_OLcRtGEOxLyeAd6VlVLzAq8ATyejPMwOrnTeY5LH_3RkngB_TyRzGQx9o5ijj-x9uJN2I25NoycSefUrDOlUO4F9M9PPDltv6FaFjAeiY1215njX4qq7lHQ8SQ24uxVFctsoGkUrq2Gy3Y5J2GV2cDKHsRRALQ5RkKiOF103TtBuYs7VPXv3oj3-ibqr4j85MtpQ","qi":"R7cjqWhLwDbcaZS2cyrUIAT8_0iuDiXwIKCY3MWB3Hn_yEK-QsYCbfnT1sMh2ZV0PYsCiKfRXRwhjM5SJigCcJn4DHOgxklqLNIqR3c3i4jXn9-gXd12ZdocSY0JxKfIM_VxxXMdPrplkSSBAPXSvdH4UvQq-a6n6DcsjJPjxl9--XqkoBvDhHInHHGCytoKAHwD_Pi-Byz2OVyqklB30llh6R8ST7Nb5bZZHjsqfY8KloQqOsOlswcRgud48sCQ2KA3LedBfxRXlMp1uT9Es84fS1tXkajtdZZF_0XW9WvRYJ8OXWC3GsTZGVbZx1KJKjQbPCh1UgMt5Zw5J5w1Vw"}`);
	const engine = NewEngine(
		kwilDBHost, 
		kwilDBProtocol,
		'test_cloud',
		privateKey,
		`7smx9dFXuLrbI8]ju+~:Jly#aMN,xis/`,
	);

	if(engine != null){
		//test engine
		console.log(await engine.getMoatFunding());
		console.log(await engine.getMoatDebit());
		console.log(await engine.preparedStatement('create table test_cloud3(id int not null primary key, name varchar(256), timestamp int)', [], true));
		console.log(await engine.preparedStatement('insert into test_cloud3 (name) values ($1),($2)', ["ccc","ddd"], true));
		console.log(await engine.preparedStatement('select * from test_cloud', [], false));
		console.log(await engine.dropTables('test_cloud'));
		// console.log(await engine.showTables());
		// console.log(await engine.descTables('test_cloud'));
		// console.log(await engine.isTableExist('test_cloud'));

		//test session
		const session = engine.NewSession();
		session.table('test_cloud3').insert([
			{
				id:2,
				name: 'ddd',
			},
			{
				id:3,
				name: 'mmm',
			},
		]);
		console.log(await session.table('test_cloud3').id(3).get());
		console.log(await session.table('test_cloud3').where('name', 'like', '%cc%').update({name: 'vvv'}));
		console.log(await session.table('test_cloud3').where('id', '=', 2).or('id', '=', 3).delete());
		console.log(await session.table('test_cloud3').get({id:1}));
		console.log(await session.table('test_cloud3').select(['id','name']).limit(3).orderBy('id', 'asc').groupBy('id').where('id', '>=', 1).exist());
		console.log(await session.table('test_cloud3').select(['id','name']).limit(3).orderBy('id', 'asc').groupBy('id').where('id', '>=', 1).get());
		console.log(await session.table('test_cloud3').select(['id','name']).limit(3).orderBy('id', 'asc').groupBy('id').where('id', '>=', 1).first());
		console.log(await session.table('test_cloud3').select(['id','name']).limit(3).orderBy('id', 'asc').groupBy('id').where('id', '>=', 1).find());

		console.log(await session.table('test_cloud3').where('id', '>', 1).groupBy('name').count('id'));
		console.log(await session.table('test_cloud3').where('id', '>', 1).groupBy('name').max('id'));
		console.log(await session.table('test_cloud3').where('id', '>', 1).groupBy('name').min('id'));
		console.log(await session.table('test_cloud3').where('id', '>', 1).groupBy('name').avg('id'));
		console.log(await session.table('test_cloud3').where('id', '>', 1).groupBy('name').sum('id'));
	}
}

// test();