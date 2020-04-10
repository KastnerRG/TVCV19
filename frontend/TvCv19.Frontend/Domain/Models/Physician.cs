using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace TvCv19.Frontend.Domain
{
    public class Physician
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; }
        public string Location { get; set; }
        public HierarchyLevel HierarchyLevel { get; set; }
        public IEnumerable<string> Messages { get; set; }
        public string SupervisorId { get; set; }
    }
    public enum HierarchyLevel { FirstLine, SecondLine, Commander }

}
