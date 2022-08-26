using Form.Api.Models.Enums;

namespace Form.Api.Models;
public class FormUser : IChangingDate
{
    public int FormUserId { get; set; }
    public string RegisterUserId { get; set; }
    public string TransactionId { get; set; }
    public string TransactionImage { get; set; }
    public decimal? ApprovedPrice { get; set; }
    public string TransactionNote { get; set; }
    public NetworkType Network { get; set; }
    public FormStatusType FromStatus { get; set; }
    public DateTime CreateDate  { get; set; }
    public DateTime? LastUpdateDate  { get; set; }
}