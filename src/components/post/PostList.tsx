/* Styles */
import './styles/post.scss';

/* Scripts */
import type { PostListProps } from './scripts/post-types';

/* Components */
import { Image } from '../image/Image';

export const PostList = (props: PostListProps) => {
	const posts = props.posts;

	return (
		<div className="posts row row-wrap row-spacing-20">
			{posts.map((post: PostType) => {
				return (
					<div id={`post-${post.id}`} className="post column column-width-33" key={post.id}>
						<div className="post-image">
							<a href={post.url}>
								<Image alt={post.image.alt} hasLazy={true} image={post.image.url} wrapperClasses={['fluid', 'fit']} />
							</a>
						</div>

						<div className="post-details">
							<h3 className="h5">
								<a href={post.url}>{post.title}</a>
							</h3>

							<p>
								{post?.author?.name ? `By ${post.author.name} on ` : ``}
								{post.date}
							</p>

							<p>{post.excerpt}</p>

							<a className="button" href={post.url}>
								Read More
							</a>
						</div>
					</div>
				);
			})}
		</div>
	);
};
