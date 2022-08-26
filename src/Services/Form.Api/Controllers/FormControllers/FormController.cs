using Form.Api.Models;
using Form.Api.Models.Enums;
using Form.Api.Services;
using Form.Api.Utility;
using Form.Api.ViewModels;
using Microsoft.AspNetCore.Mvc;
namespace Form.Api.Controllers;



[Route("api/v1/[controller]")]
[ApiController]
public partial class FormController : ControllerBase
{
    private readonly IFormService _formService;
    public FormController(IFormService formService)
    {
        _formService = formService;
    }
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] UserFormViewModel viewModel)
    {
        var file = viewModel.Image;
        string s = String.Empty;
        using (var ms = new MemoryStream())
        {
            file.CopyTo(ms);
            var fileBytes = ms.ToArray();
            s = Convert.ToBase64String(fileBytes);
        }
        try
        {
            var entity = new FormUser
            {
                Network = EnumUtil.Parse<NetworkType>(viewModel.NetworkType),
                TransactionId = viewModel.TransactionId,
                TransactionImage = s,
                RegisterUserId = viewModel.RegisterUserId,
                FromStatus = FormStatusType.ApproveRequired,
                CreateDate = DateTime.Now
            };

            var getViewModel = await _formService.Add(entity);

            return Ok(getViewModel);

        }
        catch (System.Exception ex)
        {

            return NotFound(ex.Message);
        }

    }

    [HttpGet("list")]
    public async Task<IActionResult> GetFiltered([FromQuery] GetUserFormFilterViewModel viewModel)
    {
        var viewModels = await _formService.GetFiltered(viewModel);
        return Ok(viewModels);
    }

    [HttpGet()]
    public async Task<IActionResult> GetAll()
    {
        var entities = await _formService.GetAll();
        if (entities == null)
        {
            return NotFound();
        }
        return Ok(entities);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UserFormUpdateViewModel viewModel)
    {
        var getViewModel = await _formService.Update(id, viewModel);
        return Ok(getViewModel);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var getViewModel = await _formService.GetById(id);
        return Ok(getViewModel);
    }
}
