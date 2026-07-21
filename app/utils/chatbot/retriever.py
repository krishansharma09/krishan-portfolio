import os
import json

class BaseRetriever:
    """Interface class for portfolio context retrievers."""
    def retrieve(self, query: str) -> str:
        raise NotImplementedError("Retriever must implement retrieve() method.")


class JSONRetriever(BaseRetriever):
    """Loads portfolio data from portfolio_data.json and formats it as context for LLM."""
    def __init__(self, json_path=None):
        if json_path is None:
            # Resolve absolute path relative to this file
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            json_path = os.path.join(base_dir, 'portfolio_data.json')
        self.json_path = json_path

    def retrieve(self, query: str) -> str:
        """Retrieves and returns the entire portfolio JSON contents as formatted text.
        
        Since the portfolio file is very small (< 10KB), we can feed the entire JSON
        structure directly into the Gemini model's context for maximum accuracy.
        """
        try:
            if not os.path.exists(self.json_path):
                return "Portfolio data file not found."
                
            with open(self.json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # Convert JSON data into a clean, human-readable structured context string
            return json.dumps(data, indent=2)
        except Exception as e:
            return f"Error retrieving portfolio data: {str(e)}"


class FAISSRetriever(BaseRetriever):
    """Placeholder/Template retriever for future FAISS + Embeddings migration.
    
    To migrate to FAISS:
    1. Install `faiss-cpu` (or `faiss-gpu`) and a library like `sentence-transformers` or use Google GenAI Embeddings.
    2. Build/load a FAISS index from chunked documents of portfolio data.
    3. Implement query embedding extraction and index similarity search inside retrieve().
    """
    def __init__(self, index_path=None):
        self.index_path = index_path
        # Stub configuration:
        # self.db = faiss.read_index(index_path) if os.path.exists(index_path) else None

    def retrieve(self, query: str) -> str:
        """Runs vector similarity search against the query and returns top matching chunks.
        
        Currently a stub demonstrating the future extension point.
        """
        # 1. Embed query: query_vector = embedding_model.embed(query)
        # 2. Query index: distances, indices = self.db.search(query_vector, k=3)
        # 3. Retrieve documents: docs = [self.documents[idx] for idx in indices]
        # return "\n\n".join(docs)
        return "FAISSRetriever Stub: To activate, load FAISS index and run similarity search here."
