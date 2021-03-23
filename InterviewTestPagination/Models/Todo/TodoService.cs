using System.Collections.Generic;

namespace InterviewTestPagination.Models.Todo {
    public class TodoService : IModelService<Todo> {

        private IModelRepository<Todo> _repository = new TodoRepository();

        public IModelRepository<Todo> Repository {
            get { return _repository; }
            set { _repository = value; }
        }

        /// <summary>
        /// Example implementation of List method: lists all entries of type <see cref="Todo"/>
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Todo> List() {
            // invoke Datasource layer
            return Repository.All();
        }
    }
}
