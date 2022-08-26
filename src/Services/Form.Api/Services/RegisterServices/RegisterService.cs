
using Form.Api.Infrastructure;
using Form.Api.Models;
using Form.Api.Services;
using Form.Api.ViewModels;
using Microsoft.EntityFrameworkCore;

public class RegisterService : IRegisterService
{
    private readonly FormContext _formContext;
    public RegisterService(FormContext formContext)
    {
        _formContext = formContext;
    }
    public async Task<GetRegisterViewModel> Add(RegisterUser user)
    {
        var usersByEmail = await GetByEMailAddress(user.EmailAdress);
        if (usersByEmail != null)
        {
            throw new Exception("This E-Mail already exist: " + user.EmailAdress);
        }

        var usersByPhoneNumber = await GetByPhoneNumber(user.PhoneNumber);
        if (usersByPhoneNumber != null)
        {
            throw new Exception("This Phone Number already exist: " + user.PhoneNumber);
        }

         await _formContext.RegisterUsers.AddAsync(user);
        _formContext.SaveChanges();
        return  await GetViewModel(user.RegisterUserId);

    }

    public async Task<RegisterUser> GetByEMailAddress(string emailAddress)
    {
        var registerUser = await (from o in _formContext.RegisterUsers
                                  where o.EmailAdress == emailAddress
                                  select o
                                 ).AsNoTracking()
                                  .FirstOrDefaultAsync();
        return registerUser;
    }

    public async Task<RegisterUser> GetByPhoneNumber(string phoneNumber)
    {
        var registerUser = await (from o in _formContext.RegisterUsers
                                  where o.PhoneNumber == phoneNumber
                                  select o
                                 ).AsNoTracking()
                                  .FirstOrDefaultAsync();
        return registerUser;
    }

    
    public async Task<GetRegisterViewModel> GetViewModel(int id)
    {
        var viewModel = await (from o in _formContext.RegisterUsers
                             where o.RegisterUserId == id
                             select new GetRegisterViewModel()
                             {
                                RegisterUserId = o.RegisterUserId,
                                FirstName = o.FirstName,
                                LastName = o.LastName,
                                EmailAdress = o.EmailAdress,
                                PhoneNumber = o.PhoneNumber,
                                WalletAdress = o.WalletAdress,
                                WalletProvider = o.WalletProvider
                             }).AsNoTracking()
                               .FirstOrDefaultAsync();
        return viewModel;
    }
}