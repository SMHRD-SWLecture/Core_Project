"""
Different, Together - QR 오더 서비스
데이터베이스 유틸리티 함수
"""

import os
import pymysql
from flask import current_app
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

def get_mysql_connection():
    """MySQL 연결 객체 반환"""
    try:
        connection = pymysql.connect(
            host=current_app.config['DB_HOST'],
            port=int(current_app.config['DB_PORT']),
            user=current_app.config['DB_USER'],
            password=current_app.config['DB_PASSWORD'],
            database=current_app.config['DB_NAME'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except Exception as e:
        current_app.logger.error(f"MySQL 연결 오류: {e}")
        raise

def execute_query(query, params=None, fetch=True):
    """
    MySQL 쿼리 실행
    
    Args:
        query (str): SQL 쿼리문
        params (tuple, dict, optional): 쿼리 파라미터
        fetch (bool, optional): 결과 반환 여부
        
    Returns:
        list, dict, int: 쿼리 결과 또는 영향받은 행 수
    """
    connection = None
    try:
        connection = get_mysql_connection()
        with connection.cursor() as cursor:
            cursor.execute(query, params or ())
            if fetch:
                result = cursor.fetchall()
                return result
            else:
                connection.commit()
                return cursor.rowcount
    except Exception as e:
        if connection:
            connection.rollback()
        current_app.logger.error(f"쿼리 실행 오류: {e}")
        raise
    finally:
        if connection:
            connection.close()

def execute_script(script_path):
    """
    SQL 스크립트 파일 실행
    
    Args:
        script_path (str): SQL 스크립트 파일 경로
        
    Returns:
        bool: 성공 여부
    """
    try:
        with open(script_path, 'r', encoding='utf-8') as f:
            sql_script = f.read()
        
        # SQL 문을 세미콜론으로 분리
        statements = sql_script.split(';')
        
        connection = get_mysql_connection()
        with connection.cursor() as cursor:
            for statement in statements:
                # 공백이나 주석만 있는 문장 제외
                if statement.strip() and not statement.strip().startswith('--'):
                    cursor.execute(statement)
            connection.commit()
        
        return True
    except Exception as e:
        current_app.logger.error(f"스크립트 실행 오류: {e}")
        if connection:
            connection.rollback()
        return False
    finally:
        if connection:
            connection.close()

def check_database_exists():
    """
    데이터베이스가 존재하는지 확인
    
    Returns:
        bool: 존재 여부
    """
    try:
        connection = pymysql.connect(
            host=current_app.config['DB_HOST'],
            port=int(current_app.config['DB_PORT']),
            user=current_app.config['DB_USER'],
            password=current_app.config['DB_PASSWORD'],
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            cursor.execute(f"SHOW DATABASES LIKE '{current_app.config['DB_NAME']}'")
            result = cursor.fetchone()
            return result is not None
    except Exception as e:
        current_app.logger.error(f"데이터베이스 확인 오류: {e}")
        return False
    finally:
        if connection:
            connection.close()

def initialize_database():
    """
    데이터베이스 초기화 (스키마 생성 및 초기 데이터 로드)
    
    Returns:
        bool: 성공 여부
    """
    try:
        app_root = current_app.root_path
        
        # 데이터베이스 존재 확인
        if not check_database_exists():
            # 데이터베이스 생성 스크립트 실행
            connection = pymysql.connect(
                host=current_app.config['DB_HOST'],
                port=int(current_app.config['DB_PORT']),
                user=current_app.config['DB_USER'],
                password=current_app.config['DB_PASSWORD'],
                charset='utf8mb4'
            )
            
            with connection.cursor() as cursor:
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS {current_app.config['DB_NAME']} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            connection.close()
        
        # 스키마 생성
        schema_path = os.path.join(app_root, 'db', 'schema.sql')
        if not execute_script(schema_path):
            return False
        
        # 초기 데이터 로드
        seed_path = os.path.join(app_root, 'db', 'seed_data.sql')
        return execute_script(seed_path)
        
    except Exception as e:
        current_app.logger.error(f"데이터베이스 초기화 오류: {e}")
        return False