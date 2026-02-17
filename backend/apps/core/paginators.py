from rest_framework.pagination import PageNumberPagination
from math import ceil
from rest_framework.response import Response

class BasicPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        count = self.page.paginator.count
        # Use the actual page size from the paginator, not the default
        current_page_size = self.page.paginator.per_page
        total_pages = ceil(count / current_page_size)
        return {
            'links': {
                 'next': self.get_next_link(),
                 'previous': self.get_previous_link()
            },
            'total_pages': total_pages,
            'count': count,
            'results': data
        }
    
class BasicPaginationResponse(BasicPagination):
    
    def get_paginated_response(self, data):
        return Response(super().get_paginated_response(data))
