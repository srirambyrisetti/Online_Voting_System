namespace OVS_Project.DTOs
{
    public class VoteHistoryDto
    {
        public int VoteId { get; set; }
        public string CandidateName { get; set; }
        public string ElectionTitle { get; set; }
        public DateTime VoteDate { get; set; }
    }
}
