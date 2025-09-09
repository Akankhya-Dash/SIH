export function parsePagination(query) {
  const page = Math.max(parseInt(query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || "10", 10), 1), 50);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPage({ items, page, limit, total }) {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return {
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages
    }
  };
}
