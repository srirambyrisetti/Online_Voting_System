using System.ComponentModel.DataAnnotations;

namespace OVS_Project.Models
{
    public class Election
    {
        [Key]
        public int ElectionId { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public List<Candidate> Candidates { get; set; }
    }
}
