using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OVS_Project.Controllers;
using OVS_Project.DTOs;
using OVS_Project.Models;

namespace OVS_Test
{
    [TestFixture]
    internal class ElectionControllerTests
    {
        private AppDbContext _context;
        private ElectionController _controller;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "OVS_ProjectTest")
                .Options;

            _context = new AppDbContext(options);
            _controller = new ElectionController(_context);

            ClearDatabase();
            SeedDatabase();
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        private void ClearDatabase()
        {
            _context.Elections.RemoveRange(_context.Elections);
            _context.Candidates.RemoveRange(_context.Candidates);
            _context.Votes.RemoveRange(_context.Votes);
            _context.SaveChanges();
        }

        private void SeedDatabase()
        {
            var election = new Election
            {
                ElectionId = 1,
                Title = "Test Election",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(1),
                Candidates = new List<Candidate>()
            };

            _context.Elections.Add(election);
            _context.SaveChanges();
        }

        [Test]
        public async Task GetElections_ReturnsOkResult_WithListOfElections()
        {
            // Act
            var result = await _controller.GetElections();

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<List<ElectionDto>>());
            var electionList = okResult.Value as List<ElectionDto>;
            Assert.That(electionList.Count, Is.EqualTo(1));
        }

        [Test]
        public async Task GetElection_ReturnsOkResult_WithElection()
        {
            // Arrange
            var electionId = 1;

            // Act
            var result = await _controller.GetElection(electionId);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.That(okResult.Value, Is.InstanceOf<ElectionDto>());
            var election = okResult.Value as ElectionDto;
            Assert.That(election.ElectionId, Is.EqualTo(electionId));
        }

        [Test]
        public async Task GetElection_ReturnsNotFound_WhenElectionDoesNotExist()
        {
            // Arrange
            var electionId = 2; // Election ID that does not exist in the seeded data

            // Act
            var result = await _controller.GetElection(electionId);

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundResult>());
        }


        

        [Test]
        public async Task UpdateElection_ReturnsNotFound_WhenElectionDoesNotExist()
        {
            // Arrange
            var electionId = 2; // Election ID that does not exist in the seeded data
            var updatedElection = new ElectionDto
            {
                Title = "Updated Election",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(1)
            };

            // Act
            var result = await _controller.UpdateElection(electionId, updatedElection);

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundResult>());
        }

        

        [Test]
        public async Task DeleteElection_ReturnsNotFound_WhenElectionDoesNotExist()
        {
            // Arrange
            var electionId = 2; // Election ID that does not exist in the seeded data

            // Act
            var result = await _controller.DeleteElection(electionId);

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundResult>());
        }
    }
}
