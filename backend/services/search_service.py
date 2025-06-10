class SearchResults:
    def __init__(self):
        self.total = 0
        self.results = []

class SearchService:
    async def initialize(self):
        return

    async def close(self):
        return

    async def health_check(self):
        return {"status": "healthy"}

    async def index_classification_results(self, data_source_id, results):
        return

    async def search_classifications(self, query: str, filters=None, user_id=None, page: int = 1, size: int = 20):
        return SearchResults()
