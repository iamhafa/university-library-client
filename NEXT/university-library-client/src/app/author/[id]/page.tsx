'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardFooter, CardHeader } from '@/ui/card';
import AuthorApiService, { Author } from '@/services/author.service';

export default function AuthorDetail() {
	const { id } = useParams<{ id: string }>();
	const [authorDetail, setAuthorDetail] = useState<Author>();

	useEffect(() => {
		(async () => {
			const { data } = await AuthorApiService.getOneById(id);
			setAuthorDetail(data);
		})();
	}, []);

	return (
		<Card>
			<CardHeader>
				<div>{authorDetail?.firstName}</div>
			</CardHeader>
		</Card>
	);
}
