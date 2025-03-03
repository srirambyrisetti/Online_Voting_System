using static System.Collections.Specialized.BitVector32;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OVS_Project.Models
{
    public class Candidate
    {
        [Key]
        public int CandidateId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(100)]
        public string Party { get; set; }

        public string Constituency { get; set; }

        [ForeignKey("Election")]
        public int ElectionId { get; set; }
        public Election Election { get; set; }
    }
}
