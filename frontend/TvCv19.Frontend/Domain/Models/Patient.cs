using System;

namespace TvCv19.Frontend.Domain
{
    public class Patient
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string CaregiverId { get; set; }
        public string Location { get; set; }
        public int EscalationLevel { get; set; }
        public AdmissionStatus AdmissionStatus { get; set; }
        public string Token { get; set; }
    }

 
    public enum AdmissionStatus{ Admitted, Discharged }


 
}
