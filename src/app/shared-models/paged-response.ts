import { Link } from "../shared/entities/link";
export class PagedResponse<T> {
  items: T[];
  links: Link[];
  pageSize: number;
  pageNumber: number;
  pageCount: number;
  totalCount: number;
}
