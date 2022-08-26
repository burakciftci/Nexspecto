

using Form.Api.Models;
using Form.Api.ViewModels;

namespace Form.Api.Services;

public interface IFormService
{
    Task<GetUserFormViewModel> Add(FormUser formUser);
    Task<IEnumerable<GetUserFormViewModel>> GetFiltered(GetUserFormFilterViewModel viewModel);
    Task<IEnumerable<GetUserFormViewModel>> GetAll();
    Task<GetUserFormViewModel> Update(int id, UserFormUpdateViewModel viewModel);
    Task<FormUser> Get(int id);
    Task<GetUserFormViewModel> GetById(int id);


}