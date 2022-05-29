export interface dataObject {
	[key: string]: any;
}

export type orderType = 'asc' | 'desc';

export type operatorType = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like' | 'is' | 'is not' | 'in' | 'not in'| 'between';
