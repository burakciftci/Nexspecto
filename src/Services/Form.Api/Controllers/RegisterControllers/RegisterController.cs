using Form.Api.Models;
using Form.Api.Services;
using Form.Api.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace Form.Api.Controllers;



[Route("api/v1/[controller]")]
[ApiController]
public partial class RegisterController : ControllerBase
{
    private readonly IRegisterService _registerService;
    public RegisterController(IRegisterService registerService)
    {
        _registerService = registerService;
    }
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Create(UserCreateViewModel viewModel)
    {
        try
        {
            var entity = new RegisterUser
            {
                FirstName = viewModel.FirstName,
                LastName = viewModel.LastName,
                PhoneNumber = viewModel.PhoneNumber,
                EmailAdress = viewModel.EmailAdress,
                WalletAdress = viewModel.WalletAdress,
                WalletProvider = viewModel.WalletProvider,
                CreateDate = DateTime.Now
            };
            var getViewModel = await _registerService.Add(entity);

            return Ok(getViewModel);

        }
        catch (System.Exception ex)
        {

            return NotFound(ex.Message);
        }

    }
}
