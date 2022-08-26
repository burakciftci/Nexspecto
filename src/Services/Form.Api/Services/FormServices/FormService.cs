
using Form.Api.Infrastructure;
using Form.Api.Models;
using Form.Api.Models.Enums;
using Form.Api.Services;
using Form.Api.Utility;
using Form.Api.ViewModels;
using Microsoft.EntityFrameworkCore;

public class FormService : IFormService
{
    private readonly FormContext _formContext;
    private readonly List<FormStatusType> activeStatuses = new(){ FormStatusType.ApproveRequired, 
                                                                   FormStatusType.Approve, FormStatusType.Rejected };
    public FormService(FormContext formContext)
    {
        _formContext = formContext;
    }
    public async Task<GetUserFormViewModel> Add(FormUser formUser)
    {
        var usersByEmail = await GetByTransactionId(formUser.TransactionId);
        if (usersByEmail != null)
        {
            throw new Exception("This TransactionId already exist: " + formUser.TransactionId);
        }

        await _formContext.FormUsers.AddAsync(formUser);
        _formContext.SaveChanges();
        return await GetViewModel(formUser.FormUserId);

    }

    public async Task<IEnumerable<GetUserFormViewModel>> GetFiltered(GetUserFormFilterViewModel viewModel)
    {
        var query = _formContext.FormUsers.AsQueryable();
        query = viewModel.NetworkType != null ? query.Where(dt => dt.Network == EnumUtil.Parse<NetworkType>(viewModel.NetworkType)) : query;
        query = viewModel.TransactionId != null ? query.Where(dt => dt.TransactionId == viewModel.TransactionId) : query;
        var count = await query.CountAsync();
        query = query.Skip((viewModel.PageIndex - 1) * viewModel.PageSize).Take(viewModel.PageSize);

        var formUser = await (query.Select(o => new GetUserFormViewModel()
        {
            RegisterUserId = o.RegisterUserId,
            FormUserId = o.FormUserId,
            TransactionId = o.TransactionId,
            TransactionNote = o.TransactionNote,
            ApprovedPrice = o.ApprovedPrice,
            Network = o.Network.GetDescriptionOrDefault(),
            FromStatus = o.FromStatus.GetDescriptionOrDefault(),
            Count = count

        })).AsNoTracking()
                                .ToListAsync();
        return formUser;
    }

    public async Task<FormUser> GetByTransactionId(string transactionId)
    {
        var formUser = await (from o in _formContext.FormUsers
                              where o.TransactionId == transactionId
                              select o
                                 ).AsNoTracking()
                                  .FirstOrDefaultAsync();
        return formUser;
    }

    public async Task<GetUserFormViewModel> GetViewModel(int id)
    {
        var viewModel = await (from o in _formContext.FormUsers
                               where o.FormUserId == id
                               select new GetUserFormViewModel()
                               {
                                   RegisterUserId = o.RegisterUserId,
                                   FormUserId = o.FormUserId,
                                   TransactionId = o.TransactionId,
                                   Network = o.Network.GetDescriptionOrDefault(),
                                   FromStatus = o.FromStatus.GetDescriptionOrDefault(),
                               }).AsNoTracking()
                               .FirstOrDefaultAsync();
        return viewModel;
    }

    public async Task<IEnumerable<GetUserFormViewModel>> GetAll()
    {
        var formUsers = await (from o in _formContext.FormUsers
                               select new GetUserFormViewModel()
                               {
                                   RegisterUserId = o.RegisterUserId,
                                   FormUserId = o.FormUserId,
                                   TransactionId = o.TransactionId,
                                //    TransactionImage = o.TransactionImage,
                                   Network = o.Network.GetDescriptionOrDefault(),
                                   FromStatus = o.FromStatus.GetDescriptionOrDefault(),
                               }).AsNoTracking()
                                 .ToListAsync();
        var count = formUsers.Count;
        formUsers[0].Count = count;
        return formUsers;
    }

    public async Task<GetUserFormViewModel> Update(int id, UserFormUpdateViewModel viewModel)
    {
        var result = await Get(id);
        result.ApprovedPrice =  viewModel.ApprovedPrice;
        result.TransactionNote = viewModel.TransactionNote;
        result.FromStatus = EnumUtil.Parse<FormStatusType>(viewModel.FormStatus);
        result.LastUpdateDate = DateTime.Now;
        _formContext.Attach(result);
        _formContext.SaveChanges();
        return await GetViewModel(id);
    }

    public async Task<FormUser> Get(int id)
    {
        var formUser = await TryGet(id);
        if (formUser == null)
        {
            throw new Exception("RecordNotFoundException " + id);
        }
        return formUser;
    }

    public async Task<GetUserFormViewModel> GetById(int id)
    {
         var formUsers = await (from o in _formContext.FormUsers
                                 where o.FormUserId == id
                               select new GetUserFormViewModel()
                               {
                                   RegisterUserId = o.RegisterUserId,
                                   FormUserId = o.FormUserId,
                                   TransactionId = o.TransactionId,
                                   TransactionImage = o.TransactionImage,
                                   Network = o.Network.GetDescriptionOrDefault(),
                                   FromStatus = o.FromStatus.GetDescriptionOrDefault(),
                               }).AsNoTracking()
                                 .FirstOrDefaultAsync();
            return formUsers;
    }

    public async Task<FormUser> TryGet(int id)
    {
        var formUser = await (from o in _formContext.FormUsers
                             where o.FormUserId == id
                             && activeStatuses.Contains(o.FromStatus)
                             select o
                                 )
                                  .FirstOrDefaultAsync();
        return formUser;
    }

}