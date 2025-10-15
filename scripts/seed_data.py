"""
Sample data seeding script for Convergence Platform.
Creates initial data for testing and development.
"""

import asyncio
from datetime import datetime, date
from sqlalchemy.orm import Session

from src.db.session import SessionLocal
from src.db.models.security import Users, Roles, UserRoles
from src.db.models.government import Regions, Provinces, Cities, Institutions, Officials, OfficialAssignments
from src.db.models.legal import LawIssues, Laws, LawArticles, LawTags
from src.db.models.reviews import Reviews
from src.core.security import hash_password


def create_sample_data():
    """Create sample data for testing."""
    db = SessionLocal()
    
    try:
        print("Creating sample data...")
        
        # 1. Create roles
        print("Creating roles...")
        admin_role = Roles(RoleName="Admin", Description="System administrator")
        moderator_role = Roles(RoleName="Moderator", Description="Content moderator")
        citizen_role = Roles(RoleName="Citizen", Description="Regular citizen")
        
        db.add_all([admin_role, moderator_role, citizen_role])
        db.flush()
        
        # 2. Create users
        print("Creating users...")
        admin_user = Users(
            Username="admin",
            Email="admin@convergence.ma",
            PasswordHash=hash_password("admin123"),
            FullName="System Administrator",
            Language="en",
            IsActive=True,
            DateCreated=datetime.utcnow(),
            VerifiedCitizen=True
        )
        
        moderator_user = Users(
            Username="moderator",
            Email="moderator@convergence.ma",
            PasswordHash=hash_password("mod123"),
            FullName="Content Moderator",
            Language="fr",
            IsActive=True,
            DateCreated=datetime.utcnow(),
            VerifiedCitizen=True
        )
        
        citizen_user = Users(
            Username="citizen",
            Email="citizen@convergence.ma",
            PasswordHash=hash_password("citizen123"),
            FullName="Ahmed Alami",
            Language="ar",
            IsActive=True,
            DateCreated=datetime.utcnow(),
            VerifiedCitizen=True
        )
        
        db.add_all([admin_user, moderator_user, citizen_user])
        db.flush()
        
        # 3. Assign roles
        print("Assigning roles...")
        admin_user_role = UserRoles(UserID=admin_user.UserID, RoleID=admin_role.RoleID)
        moderator_user_role = UserRoles(UserID=moderator_user.UserID, RoleID=moderator_role.RoleID)
        citizen_user_role = UserRoles(UserID=citizen_user.UserID, RoleID=citizen_role.RoleID)
        
        db.add_all([admin_user_role, moderator_user_role, citizen_user_role])
        
        # 4. Create territorial areas
        print("Creating territorial areas...")
        rabat_sale_kenitra = Regions(
            RegionName="Rabat-Salé-Kénitra",
            Code="RSK",
            Population=4500000
        )
        
        db.add(rabat_sale_kenitra)
        db.flush()
        
        rabat_province = Provinces(
            RegionID=rabat_sale_kenitra.RegionID,
            ProvinceName="Rabat",
            Code="RBT"
        )
        
        db.add(rabat_province)
        db.flush()
        
        rabat_city = Cities(
            ProvinceID=rabat_province.ProvinceID,
            CityName="Rabat",
            Population=600000
        )
        
        db.add(rabat_city)
        db.flush()
        
        # Update region with capital city
        rabat_sale_kenitra.CapitalCityID = rabat_city.CityID
        
        # 5. Create institutions
        print("Creating institutions...")
        ministry_interior = Institutions(
            InstitutionName="Ministry of Interior",
            InstitutionType="Ministry",
            ParentInstitutionID=None,
            RegionID=rabat_sale_kenitra.RegionID,
            Code="MI"
        )
        
        ministry_justice = Institutions(
            InstitutionName="Ministry of Justice",
            InstitutionType="Ministry",
            ParentInstitutionID=None,
            RegionID=rabat_sale_kenitra.RegionID,
            Code="MJ"
        )
        
        ministry_finance = Institutions(
            InstitutionName="Ministry of Economy and Finance",
            InstitutionType="Ministry",
            ParentInstitutionID=None,
            RegionID=rabat_sale_kenitra.RegionID,
            Code="MEF"
        )
        
        db.add_all([ministry_interior, ministry_justice, ministry_finance])
        db.flush()
        
        # 6. Create officials
        print("Creating officials...")
        minister_interior = Officials(
            FullName="Abdelouafi Laftit",
            PhotoURL=None,
            Biography="Minister of Interior since 2017",
            ContactInfo="minister@interior.gov.ma"
        )
        
        minister_justice = Officials(
            FullName="Mohamed Ben Abdelkader",
            PhotoURL=None,
            Biography="Minister of Justice since 2021",
            ContactInfo="minister@justice.gov.ma"
        )
        
        minister_finance = Officials(
            FullName="Nadia Fettah Alaoui",
            PhotoURL=None,
            Biography="Minister of Economy and Finance since 2021",
            ContactInfo="minister@finance.gov.ma"
        )
        
        db.add_all([minister_interior, minister_justice, minister_finance])
        db.flush()
        
        # 7. Create official assignments
        print("Creating official assignments...")
        assignment_interior = OfficialAssignments(
            OfficialID=minister_interior.OfficialID,
            InstitutionID=ministry_interior.InstitutionID,
            PositionTitle="Minister",
            StartDate=date(2017, 4, 5),
            EndDate=None,
            IsActive=True
        )
        
        assignment_justice = OfficialAssignments(
            OfficialID=minister_justice.OfficialID,
            InstitutionID=ministry_justice.InstitutionID,
            PositionTitle="Minister",
            StartDate=date(2021, 10, 7),
            EndDate=None,
            IsActive=True
        )
        
        assignment_finance = OfficialAssignments(
            OfficialID=minister_finance.OfficialID,
            InstitutionID=ministry_finance.InstitutionID,
            PositionTitle="Minister",
            StartDate=date(2021, 10, 7),
            EndDate=None,
            IsActive=True
        )
        
        db.add_all([assignment_interior, assignment_justice, assignment_finance])
        
        # 8. Create law issues
        print("Creating law issues...")
        issue_2024_1 = LawIssues(
            IssueNumber="2024-1",
            PublicationDate=date(2024, 1, 15),
            SourceURL="https://www.bulletin-officiel.ma/2024/1",
            PDFFilePath="/data/raw/2024-1.pdf"
        )
        
        issue_2024_2 = LawIssues(
            IssueNumber="2024-2",
            PublicationDate=date(2024, 2, 15),
            SourceURL="https://www.bulletin-officiel.ma/2024/2",
            PDFFilePath="/data/raw/2024-2.pdf"
        )
        
        db.add_all([issue_2024_1, issue_2024_2])
        db.flush()
        
        # 9. Create laws
        print("Creating laws...")
        law_tax_reform = Laws(
            IssueID=issue_2024_1.IssueID,
            LawNumber="01-24",
            Title="Law on Tax Reform and Modernization",
            Category="Tax",
            EffectiveDate=date(2024, 3, 1),
            Summary="This law modernizes the tax system and introduces new tax rates for businesses and individuals."
        )
        
        law_labor_rights = Laws(
            IssueID=issue_2024_2.IssueID,
            LawNumber="02-24",
            Title="Law on Labor Rights and Social Protection",
            Category="Labor",
            EffectiveDate=date(2024, 4, 1),
            Summary="This law strengthens labor rights and improves social protection for workers."
        )
        
        db.add_all([law_tax_reform, law_labor_rights])
        db.flush()
        
        # 10. Create law articles
        print("Creating law articles...")
        article_tax_1 = LawArticles(
            LawID=law_tax_reform.LawID,
            ArticleNumber="Article 1",
            Content="This law applies to all natural and legal persons subject to Moroccan tax legislation.",
            Keywords="tax, persons, legislation"
        )
        
        article_tax_2 = LawArticles(
            LawID=law_tax_reform.LawID,
            ArticleNumber="Article 2",
            Content="The corporate tax rate is set at 20% for companies with annual revenue exceeding 10 million MAD.",
            Keywords="corporate tax, rate, revenue"
        )
        
        article_labor_1 = LawArticles(
            LawID=law_labor_rights.LawID,
            ArticleNumber="Article 1",
            Content="All workers have the right to fair wages, safe working conditions, and social protection.",
            Keywords="workers, wages, conditions, protection"
        )
        
        article_labor_2 = LawArticles(
            LawID=law_labor_rights.LawID,
            ArticleNumber="Article 2",
            Content="The minimum wage is set at 3,500 MAD per month for all sectors.",
            Keywords="minimum wage, sectors"
        )
        
        db.add_all([article_tax_1, article_tax_2, article_labor_1, article_labor_2])
        
        # 11. Create law tags
        print("Creating law tags...")
        tag_tax = LawTags(LawID=law_tax_reform.LawID, TagName="Taxation")
        tag_business = LawTags(LawID=law_tax_reform.LawID, TagName="Business")
        tag_labor = LawTags(LawID=law_labor_rights.LawID, TagName="Labor Rights")
        tag_social = LawTags(LawID=law_labor_rights.LawID, TagName="Social Protection")
        
        db.add_all([tag_tax, tag_business, tag_labor, tag_social])
        
        # 12. Create reviews
        print("Creating reviews...")
        review_1 = Reviews(
            OfficialID=minister_interior.OfficialID,
            UserID=citizen_user.UserID,
            Rating=4.5,
            Title="Good communication during crisis",
            Comment="The minister showed good leadership during the recent crisis management.",
            DatePosted=datetime.utcnow(),
            IsApproved=True,
            FlagCount=0
        )
        
        review_2 = Reviews(
            OfficialID=minister_justice.OfficialID,
            UserID=citizen_user.UserID,
            Rating=3.8,
            Title="Reform progress is slow",
            Comment="While the justice reform is moving forward, the pace could be faster.",
            DatePosted=datetime.utcnow(),
            IsApproved=True,
            FlagCount=0
        )
        
        db.add_all([review_1, review_2])
        
        # Commit all changes
        db.commit()
        print("Sample data created successfully!")
        
        # Print summary
        print("\nData Summary:")
        print(f"- Users: {db.query(Users).count()}")
        print(f"- Roles: {db.query(Roles).count()}")
        print(f"- Territorial Areas: {db.query(Regions).count() + db.query(Provinces).count() + db.query(Cities).count()}")
        print(f"- Institutions: {db.query(Institutions).count()}")
        print(f"- Officials: {db.query(Officials).count()}")
        print(f"- Official Assignments: {db.query(OfficialAssignments).count()}")
        print(f"- Law Issues: {db.query(LawIssues).count()}")
        print(f"- Laws: {db.query(Laws).count()}")
        print(f"- Law Articles: {db.query(LawArticles).count()}")
        print(f"- Law Tags: {db.query(LawTags).count()}")
        print(f"- Reviews: {db.query(Reviews).count()}")
        
        print("\nTest Credentials:")
        print("Admin: admin@convergence.ma / admin123")
        print("Moderator: moderator@convergence.ma / mod123")
        print("Citizen: citizen@convergence.ma / citizen123")
        
    except Exception as e:
        print(f"Error creating sample data: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_sample_data()
