import React from 'react';
import PropTypes from 'prop-types';

export default function Posts({ posts }) {
  return (
    <ul>
      {posts.map((post, i) =>
        <li key={i}>{post.title}</li>
      )}
    </ul>
  );
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired,
};
