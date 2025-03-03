using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OVS_Project.Models
{
    public class Vote
    {
        [Key]
        public int VoteId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }

        [ForeignKey("Candidate")]
        public int CandidateId { get; set; }
        public Candidate Candidate { get; set; }

        [Required]  
        public DateTime VoteDate { get; set; } = DateTime.Now;
    }
}
