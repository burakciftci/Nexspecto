

using Form.Api.Models;
using Form.Api.ViewModels;

namespace Form.Api.Services;

public interface IRegisterService
{
  Task<GetRegisterViewModel> Add(RegisterUser user);

}