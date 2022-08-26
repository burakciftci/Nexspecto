namespace Form.Api.Utility
{
    [AttributeUsage(AttributeTargets.All, Inherited = false, AllowMultiple = true)]
    public sealed class ReturnCode : Attribute
    {
        public ReturnCode()
        {}
        public string Code { get; set; }

        public string GetCode() { return Code; }
    }
}