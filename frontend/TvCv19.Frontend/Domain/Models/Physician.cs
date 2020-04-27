using System;

namespace TvCv19.Frontend.Domain
{
    public class Physician
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public Hierarchy Hierarchy { get; set; }
        public string SupervisorId { get; set; }
    }
    public enum Hierarchy { FirstLine, SecondLine, Commander }

}
