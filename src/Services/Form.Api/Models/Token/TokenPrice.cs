namespace Form.Api.Models;
public class TokenPrice : IChangingDate
{
    public int TokenPriceId { get; set; }
    public string TokenPriceCode { get; set; }
    public decimal TokenPriceAmount { get; set; }
    public DateTime CreateDate  { get; set; }
    public DateTime? LastUpdateDate  { get; set; }
}