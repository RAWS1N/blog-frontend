// @ts-nocheck
import { useQueryClient } from '@tanstack/react-query';

const useBlogById = (id) => {
  const queryClient =  useQueryClient();

  const blogs = queryClient.getQueryData('data');

  const blog = blogs.find((blog) => blog.id === id);

  return blog;
};

export default useBlogById;