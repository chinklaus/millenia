import React from 'react';
import { useRouter } from 'next/router';
import { getPage, getAllDocSlugs } from '@/data';
import NotFoundPage from '@/pages/404';
import { Module } from '@/components/modules';
import cx from 'classnames';

const Page = ({ data }) => {
	const { page } = data;
	const router = useRouter();

	if (!router.isFallback && !data) {
		return <NotFoundPage statusCode={404} />;
	}

	return (
		<>
			{!router.isFallback && (
				<div className={cx('page-general', 'c-3')}>
					{page.modules?.map((module, key) => (
						<Module key={key} index={key} module={module} />
					))}
				</div>
			)}

			<style jsx>{``}</style>
		</>
	);
};

export async function getStaticProps({ params, preview, previewData }) {
	const pageData = await getPage(params.slug.join('/'), {
		active: preview,
		token: previewData?.token,
	});

	return {
		props: {
			data: pageData,
		},
		revalidate: Number(process.env.NEXT_PUBLIC_REVALIDATE_TIME),
	};
}

export async function getStaticPaths() {
	const allPages = await getAllDocSlugs('pGeneral');

	return {
		paths:
			allPages?.map((page) => {
				let slugs = page.slug.split('/').filter((e) => e);
				return {
					params: {
						slug: slugs,
					},
				};
			}) || [],
		fallback: false,
	};
}

export default Page;