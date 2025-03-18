using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OVS_Project.DTOs;
using OVS_Project.Models;

namespace OVS_Project.Controllers
{
   // [Authorize(Roles = "Voter")]
    [Route("api/[controller]")]
    [ApiController]
    public class VoteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VoteController(AppDbContext context)
        {
            _context = context; 
        }

        // Cast a vote
        //[HttpPost]
        //public async Task<IActionResult> CastVote(VoteDto voteDto)
        //{
        //    // Ensure the voter has not already voted for this candidate
        //    var existingVote = await _context.Votes
        //        .FirstOrDefaultAsync(v => v.UserId == voteDto.UserId && v.CandidateId == voteDto.CandidateId);

        //    if (existingVote != null)
        //    {
        //        return BadRequest(new { message = "You have already voted for this candidate" });
        //    }

        //    // Get the voter and candidate details
        //    var voter = await _context.Voters.FindAsync(voteDto.UserId);
        //    var candidate = await _context.Candidates.FindAsync(voteDto.CandidateId);

        //    if (voter == null || candidate == null)
        //    {
        //        return NotFound(new { message = "Voter or Candidate not found" });
        //    }

        //    // Check if the constituencies match
        //    if (voter.Constituency != candidate.Constituency)
        //    {
        //        return BadRequest(new { message = "Voter and Candidate must be from the same constituency" });
        //    }

        //    var vote = new Vote
        //    {
        //        UserId = voteDto.UserId,
        //        CandidateId = voteDto.CandidateId,
        //        VoteDate = DateTime.Now
        //    };

        //    _context.Votes.Add(vote);
        //    await _context.SaveChangesAsync();
        //    return Ok(new { message = "Vote cast successfully" });
        //}

        [HttpPost]
        public async Task<IActionResult> CastVote(VoteDto voteDto)
        {
            // Get the voter and candidate details
            var voter = await _context.Voters.FindAsync(voteDto.UserId);
            var candidate = await _context.Candidates.FindAsync(voteDto.CandidateId);

            if (voter == null || candidate == null)
            {
                return NotFound(new { message = "Voter or Candidate not found" });
            }

            // Check if the constituencies match
            if (voter.Constituency != candidate.Constituency)
            {
                return BadRequest(new { message = "Voter and Candidate must be from the same constituency" });
            }

            // Ensure the voter has not already voted in this election
            var existingVote = await _context.Votes
                .Include(v => v.Candidate)
                .FirstOrDefaultAsync(v => v.UserId == voteDto.UserId && v.Candidate.ElectionId == candidate.ElectionId);

            if (existingVote != null)
            {
                return BadRequest(new { message = "You have already voted in this election" });
            }

            var vote = new Vote
            {
                UserId = voteDto.UserId,
                CandidateId = voteDto.CandidateId,
                VoteDate = DateTime.Now
            };

            _context.Votes.Add(vote);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Vote cast successfully" });
        }


        // Get voting history for a user
        [HttpGet("history/{userId}")]
        public async Task<IActionResult> GetVotingHistory(int userId)
        {
            var votes = await _context.Votes
                .Include(v => v.Candidate)
                .ThenInclude(c => c.Election)
                .Where(v => v.UserId == userId)
                .Select(v => new VoteHistoryDto
                {
                    VoteId = v.VoteId,
                    CandidateName = v.Candidate.Name,
                    ElectionTitle = v.Candidate.Election.Title,
                    VoteDate = v.VoteDate
                })
                .ToListAsync();

            return Ok(votes);
        }
    }
}
