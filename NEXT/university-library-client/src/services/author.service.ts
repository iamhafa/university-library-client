import { AxiosResponse } from 'axios';
import api from '@/config/api.config';
import { TBaseEntity } from '@/types/base-entity.type';

export type Author = TBaseEntity & {
	firstName: string;
	lastName: string;
	bio: string;
};

export default abstract class AuthorApiService {
	static getAll(): Promise<AxiosResponse<Author[]>> {
		return api.get('/author');
	}

	static getOneById(id: string): Promise<AxiosResponse<Author>> {
		return api.get(`/author/${id}`);
	}
}
