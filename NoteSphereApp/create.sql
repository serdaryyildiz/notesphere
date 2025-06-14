
    create table dbo.categories (
        id bigint identity not null,
        name varchar(255) not null,
        primary key (id)
    );

    create table dbo.comments (
        createdAt datetime2(6),
        id bigint identity not null,
        note_id bigint not null,
        updatedAt datetime2(6),
        user_id bigint not null,
        commentable_type varchar(255) not null check (commentable_type in ('NOTE','REPOSITORY')),
        content TEXT,
        primary key (id)
    );

    create table dbo.follows (
        createdAt datetime2(6),
        followed_id bigint not null,
        follower_id bigint not null,
        id bigint identity not null,
        primary key (id)
    );

    create table dbo.friendships (
        createdAt datetime2(6),
        id bigint identity not null,
        receiver_id bigint not null,
        requester_id bigint not null,
        updatedAt datetime2(6),
        status varchar(255) not null check (status in ('PENDING','ACCEPTED','REJECTED','BLOCKED')),
        primary key (id)
    );

    create table dbo.likes (
        createdAt datetime2(6),
        id bigint identity not null,
        likeable_id bigint not null,
        user_id bigint not null,
        likeable_type varchar(255) not null check (likeable_type in ('NOTE','REPOSITORY')),
        primary key (id)
    );

    create table dbo.messages (
        createdAt datetime2(6),
        deletedAt datetime2(6),
        id bigint identity not null,
        receiver_id bigint not null,
        sender_id bigint not null,
        content TEXT,
        status varchar(255) check (status in ('SENT','DELIVERED','READ')),
        primary key (id)
    );

    create table dbo.note_repositories (
        createdAt datetime2(6),
        creator_id bigint not null,
        deletedAt datetime2(6),
        id bigint identity not null,
        updatedAt datetime2(6),
        description varchar(255),
        name varchar(255) not null,
        visibility varchar(255) not null check (visibility in ('PUBLIC','PRIVATE')),
        primary key (id)
    );

    create table dbo.notes (
        category_id bigint,
        createdAt datetime2(6),
        creator_id bigint not null,
        deletedAt datetime2(6),
        id bigint identity not null,
        updatedAt datetime2(6),
        content TEXT,
        title varchar(255),
        visibility varchar(255) check (visibility in ('PUBLIC','PRIVATE')),
        primary key (id)
    );

    create table dbo.notifications (
        isRead bit not null,
        createdAt datetime2(6),
        id bigint identity not null,
        referenceId bigint,
        user_id bigint not null,
        content TEXT,
        referenceType varchar(255) check (referenceType in ('NOTE','REPOSITORY','USER','MESSAGE')),
        type varchar(255) check (type in ('LIKE','COMMENT','FRIEND_REQUEST','SHARE','FOLLOW','MESSAGE')),
        primary key (id)
    );

    create table dbo.shared_notes (
        createdAt datetime2(6),
        id bigint identity not null,
        note_id bigint not null,
        user_id bigint not null,
        permissionType varchar(255) not null check (permissionType in ('READ','WRITE')),
        primary key (id)
    );

    create table dbo.shared_repositories (
        createdAt datetime2(6),
        id bigint identity not null,
        repository_id bigint not null,
        user_id bigint not null,
        permissionType varchar(255) not null check (permissionType in ('READ','WRITE')),
        primary key (id)
    );

    create table dbo.users (
        createdAt datetime2(6),
        dateOfBirth datetime2(6),
        deletedAt datetime2(6),
        id bigint identity not null,
        lastLoginAt datetime2(6),
        updatedAt datetime2(6),
        aboutMe TEXT,
        email varchar(255),
        firstName varchar(255),
        lastName varchar(255),
        nickname varchar(255),
        password varchar(255),
        phoneNumber varchar(255),
        status varchar(255) check (status in ('ACTIVE','INACTIVE','BANNED')),
        username varchar(255),
        primary key (id)
    );

    alter table dbo.categories 
       add constraint UK_t8o6pivur7nn124jehx7cygw5 unique (name);

    create unique nonclustered index UK_6dotkott2kjsp8vw4d0m25fb7 
       on dbo.users (email) where email is not null;

    create unique nonclustered index UK_r43af9ap4edm43mmtq01oddj6 
       on dbo.users (username) where username is not null;

    create table dbo.repository_notes (
        note_id bigint not null,
        repository_id bigint not null
    );

    alter table dbo.comments 
       add constraint FK9iabamoajs0wme1dmrp7tfqv6 
       foreign key (note_id) 
       references dbo.notes;

    alter table dbo.comments 
       add constraint FK8omq0tc18jd43bu5tjh6jvraq 
       foreign key (user_id) 
       references dbo.users;

    alter table dbo.follows 
       add constraint FKfn8b8fg2ldipv2sbbplknlinn 
       foreign key (followed_id) 
       references dbo.note_repositories;

    alter table dbo.follows 
       add constraint FKqnkw0cwwh6572nyhvdjqlr163 
       foreign key (follower_id) 
       references dbo.users;

    alter table dbo.friendships 
       add constraint FKpk7w2cj6m9n224ny2t7fhi47 
       foreign key (receiver_id) 
       references dbo.users;

    alter table dbo.friendships 
       add constraint FKas6bp8so5n3pfcqtfxt72e1ii 
       foreign key (requester_id) 
       references dbo.users;

    alter table dbo.likes 
       add constraint FKnvx9seeqqyy71bij291pwiwrg 
       foreign key (user_id) 
       references dbo.users;

    alter table dbo.likes 
       add constraint FKfvy4kjn3cytsp5ahibcklvhsh 
       foreign key (likeable_id) 
       references dbo.note_repositories;

    alter table dbo.messages 
       add constraint FKt05r0b6n0iis8u7dfna4xdh73 
       foreign key (receiver_id) 
       references dbo.users;

    alter table dbo.messages 
       add constraint FK4ui4nnwntodh6wjvck53dbk9m 
       foreign key (sender_id) 
       references dbo.users;

    alter table dbo.note_repositories 
       add constraint FK89e5jj1dxnnapwdfk9ojo5y0v 
       foreign key (creator_id) 
       references dbo.users;

    alter table dbo.notes 
       add constraint FKt8k9l9q6louhlu7udo6r6l1et 
       foreign key (category_id) 
       references dbo.categories;

    alter table dbo.notes 
       add constraint FK36j06rxyunv0c9is8wpk050bv 
       foreign key (creator_id) 
       references dbo.users;

    alter table dbo.notifications 
       add constraint FK9y21adhxn0ayjhfocscqox7bh 
       foreign key (user_id) 
       references dbo.users;

    alter table dbo.shared_notes 
       add constraint FKf8g69qsjifnm46xwjausrbs52 
       foreign key (note_id) 
       references dbo.notes;

    alter table dbo.shared_notes 
       add constraint FK6yly1benh4saccq0vyhsuqvw2 
       foreign key (user_id) 
       references dbo.users;

    alter table dbo.shared_repositories 
       add constraint FKiin2e1v0g6gvjj38ykmxap4y6 
       foreign key (repository_id) 
       references dbo.note_repositories;

    alter table dbo.shared_repositories 
       add constraint FK7s9yfyrxggiu2xj6cd4lpsysb 
       foreign key (user_id) 
       references dbo.users;

    alter table dbo.repository_notes 
       add constraint FKf57745t1en88cbr6brdl9cnxo 
       foreign key (repository_id) 
       references dbo.note_repositories;

    alter table dbo.repository_notes 
       add constraint FK8tgm0owb1p56wns45sdm6bf07 
       foreign key (note_id) 
       references dbo.notes;
