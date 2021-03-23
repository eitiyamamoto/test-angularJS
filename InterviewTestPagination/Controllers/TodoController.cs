using System.Collections.Generic;
using System.Web.Http;
using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;
using InterviewTestPagination.Business;

namespace InterviewTestPagination.Controllers {
    /// <summary>
    /// 'Rest' controller for the <see cref="Todo"/>
    /// model.
    /// </summary>
    public class TodoController : ApiController {

        // TODO: [low priority] setup DI 
        private readonly IModelService<Todo> _todoService = new TodoService();

        private ToDoResponseBO _todoResponseBO = new ToDoResponseBO();
        
        /// <summary>
        /// Endpoint to get todo list and other information
        /// </summary>
        /// <param name="pageSize">Page size</param>
        /// <param name="currentPage">Current page</param>
        /// <param name="orderItem">Order Item</param>
        /// <param name="order">Order</param>
        /// <returns></returns>
        [HttpGet]
        public ToDoResponse ToDoResponse(int pageSize, int currentPage, string orderItem, int order)
        {
            return _todoResponseBO.createResponse(pageSize, currentPage, orderItem, order);
        }
    }
}
