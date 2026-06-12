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
					<div id={`post-${post.id}`} className="post column column-width-50" key={post.id}>
						<div className="post-image">
							<a href={post.url}>
								<Image alt={post.image.alt} hasLazy={true} image={post.image.url} wrapperClasses={['fluid', 'fit']} />
							</a>
						</div>

						<div className="post-details">
							<h3 className="post-title h5">
								<a href={post.url}>{post.title}</a>
							</h3>

							<div className="post-meta">
								{post?.author?.name ? <span className="post-author">By {post.author.name} on</span> : null}

								<span className="post-date">{post.date}</span>
							</div>

							<div className="post-content">
								<p>{post.excerpt}</p>
							</div>

							<div className="post-read-more">
								<a className="button" href={post.url}>
									Read More
								</a>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
