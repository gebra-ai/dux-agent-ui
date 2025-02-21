export const List: any = [
    {
        "id": 1,
        "title": "December",
        "description": "version 1.0.1",
        "version": "v1.0.1",
        "content": [
            {
                "list": [
                    "Connect to a datasource and explore",
                    "Prepare elastic search index for given datasource",
                    "Prepare indexing code to move data from datasource to elastic search index",
                    "Chat Framework selection and initial codebase setup",
                    "Develop Backend service API Layer to handle user interaction",
                    "Devops - Cloud setup, deployment"
                ]
            }
        ]
    },
    {
        "id": 2,
        "title": "January",
        "description": "version 1.0.2",
        "version": "v1.0.2",
        "content": [
            {
                "list": [
                    "Agentic Flow to generate the source code for Elastic and Semantic search",
                    "Source code browser for user to review the code before committing to a repo",
                    "Commit the generated code to Github",
                    "Parse the datasource and index into Vector database for Semantic Search",
                    "ES - Execute the generated search code and produce results as chat response",
                    "Semantic Search - Execute the generated search code and produce results as chat response"
                ]
            }
        ]
    },
    {
        "id": 3,
        "title": "February",
        "description": "version 1.0.3",
        "version": "v1.0.3",
        "parent": "February",
        "content": [
            {
                "list": [
                    "Deployment agent -  the generated code in Docker Container",
                    "Code-RAG feature to create embeddings from reference templates and influence code generation",
                    "Clean all option to wipe out all artifacts and work products",
                    "Develop a standalone search application through which the generated/deployed search api can be accessedd",
                    "Observability stack setup - OpenLit integration and deployment"
                ]
            }
        ]
    },
    {
        "id": 4,
        "title": "February",
        "description": "version 1.0.4",
        "version": "v1.0.4",
        "parent": "February",
        "content": [
            {
                "list": [
                    "Breakdown of Agentic flow into multiple smaller flows",
                    "Elastic Search - Display data distribution and analytics",
                    "Stage validation, progress tracking and session management",
                    "Connect to existing elastic search index",
                    "Logs - Agentic review",
                    "Extend support for existing ES index",
                    "Support for multiple ES index",
                    "User profile creation"
                ]
            }
        ]
    },
]

interface InputItem {
    id: number;
    title: string;
    description: string;
    version: string;
    parent?: string;
    content: Array<{
        list: string[];
    }>;
}

interface VersionItem {
    id: number;
    title: string;
}

interface OutputItem {
    id?: number;
    title: string;
    version?: string;
    parent?: string;
    versions?: VersionItem[];
}

export function transformData(input: InputItem[]): OutputItem[] {
    const groupedByTitle = input.reduce((acc: { [key: string]: InputItem[] }, item) => {
      if (!acc[item.title]) {
        acc[item.title] = [];
      }
      acc[item.title].push(item);
      return acc;
    }, {});
  
    return Object.entries(groupedByTitle).map(([title, items]) => {
      // If there's only one item for this title
      if (items.length === 1) {
        const item = items[0];
        return {
          id: item.id,
          title: item.title,
          version: item.version
        };
      }
  
      // If there are multiple items (versions) for this title
      return {
        title: title,
        parent: items[0].parent,
        ids: items.map(item => item.id),
        versions: items.map(item => ({
          id: item.id,
          title: item.version
        }))
      };
    });
  }