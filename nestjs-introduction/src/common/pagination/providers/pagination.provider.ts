import { Injectable, Inject } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Paginated } from '../interfaces/paginated.interface';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

@Injectable()
export class PaginationProvider<T extends ObjectLiteral> {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async paginateQuery(
    paginationQuery: PaginationQueryDto,
    findManyOptions: FindManyOptions<T>,
    repository: Repository<T>,
  ) {
    const results = await repository.find({
      skip: (paginationQuery?.page || 1 - 1) * (paginationQuery?.limit || 20),
      take: paginationQuery.limit,
      ...findManyOptions,
    });

    // create request urls
    const baseURL = `${this.request.protocol}://${this.request.headers.host}/`;
    const newURL = new URL(this.request.url, baseURL);

    // calculate page number
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / (paginationQuery?.limit || 20));
    const nextPage =
      paginationQuery?.page === totalPages
        ? paginationQuery.page
        : (paginationQuery?.page || 1) + 1;
    const prevPage =
      paginationQuery?.page === 1
        ? paginationQuery.page
        : (paginationQuery.page || 1) - 1;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        totalItems,
        totalPages,
        itemsPerPage: paginationQuery?.limit || 20,
        currentPage: paginationQuery?.page || 1,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=1`,
        last: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${totalPages}`,
        prev: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${prevPage}`,
        next: `${newURL.origin}${newURL.pathname}?limit=${paginationQuery.limit}&page=${nextPage}`,
      },
    };

    return finalResponse;
  }
}
