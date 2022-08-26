namespace Form.Api.Models;
public interface IChangingDate
{
    DateTime CreateDate { get; set; }
    DateTime? LastUpdateDate { get; set; }
}