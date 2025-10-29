-- =============================================
-- Database: CourseManagement
-- Description: Schema for Course Management System
-- =============================================

CREATE DATABASE CourseManagement;
GO

USE CourseManagement;
GO

-- =============================================
-- Table: Users
-- =============================================
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    DateOfBirth DATE NULL,
    PhoneNumber NVARCHAR(20) NULL,
    [Password] NVARCHAR(200) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    IsAdmin BIT NOT NULL DEFAULT 0,
    CreatedOn DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- Table: Courses
-- =============================================
CREATE TABLE Courses (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    DurationInMonths INT NOT NULL,
    StartDate DATE NOT NULL,
    MinimumRequiredAge INT NOT NULL,
    CreatedOn DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- Table: Enrollments
-- =============================================
CREATE TABLE Enrollments (
    EnrollmentId INT IDENTITY(1,1) PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    CourseId INT NOT NULL,
    EnrolledOn DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Enrollments_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Enrollments_Courses FOREIGN KEY (CourseId) REFERENCES Courses(Id) ON DELETE CASCADE
);
GO

-- =============================================
-- Optional: Add Constraints for Business Rules
-- =============================================

-- Ensure user cannot enroll in same course more than once
ALTER TABLE Enrollments
ADD CONSTRAINT UQ_Enrollments_User_Course UNIQUE (UserId, CourseId);
GO
