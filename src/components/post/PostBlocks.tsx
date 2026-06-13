/* Styles */
import './styles/post.scss';

/* Scripts */
import type { PostBlocksProps } from './scripts/post-types';

/* Components */
import { Image } from '../image/Image';

export const PostImage = (props: PostBlocksProps) => {
	const post = props.post;

	return (
		<div className="post-image">
			<a href={post.url}>
				<Image alt={post.image.alt} hasLazy={true} image={post.image.url} wrapperClasses={['fluid', 'fit']} />
			</a>
		</div>
	);
};

export const PostMeta = (props: PostBlocksProps) => {
	const post = props.post;

	return (
		<div className="post-meta">
			{post?.author?.name ? (
				<span className="post-author">
					By <a href={post.author.url}>{post.author.name}</a> on
				</span>
			) : null}

			<span className="post-date">{post.date}</span>
		</div>
	);
};
